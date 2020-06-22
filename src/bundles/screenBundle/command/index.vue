<template>
  <section class="jc-screen-warp">
    <!-- 顶部header -->
    <command-header></command-header>
    <!-- 地图搜索组件 -->
    <map-search ref="mapSearch" class="jc-area-search"></map-search>
    <!-- 地图对象 -->
    <div class="jc-screen-space" ref="myMap"></div>
    <!-- 左侧操作组件 -->
    <command-operate></command-operate>
    <!-- 左下角数据 -->
    <data-overview :project="project"></data-overview>
    <!-- 右侧信息显示区域动态显示组件 -->
    <div class="jc-view-space" :class="{'jc-message-show': !!messageComponent}">
      <transition name="jc-view">
        <keep-alive>
          <component :is="viewComponent" :options="viewOptions" :project="project"></component>
        </keep-alive>
      </transition>
    </div>
    <!-- 右下侧消息显示区域动态显示组件 -->
    <transition name="jc-message">
      <keep-alive>
        <component :is="messageComponent" :options="messageOptions" :project="project"></component>
      </keep-alive>
    </transition>
    <!-- 临时任务下发 -->
    <temporary-tasks-manage :projectList="temporaryTaskProject" :projectId="temporaryTaskprojectId" :visible.sync="temporaryTaskVisible" @save-success="temporaryTaskSuccess"></temporary-tasks-manage>
    <!-- 音视频处理 -->
    <media-live></media-live>
  </section>
</template>
<script>
import { JcMap } from '@/map'
import { projectGet } from '@/api/projects'
import OrgMixins from './modules/mixins/orgMixins' //组织显示处理
import TemporaryTasksMixins from './modules/mixins/temporaryTasksMixins' //临时任务下发
import ScreenMapSocketMixins from './modules/mixins/screenMapSocketMixins' //大屏socket 连接
import GridMixins from './modules/mixins/gridMixins' //网格处理
import UserMixins from './modules/mixins/userMixins.js' //用户处理
import CommandHeader from './modules/header'//顶部

let myJcMap //个人 map 对象

export default {
  name: 'ScreenCommand',
  mixins: [OrgMixins, GridMixins, UserMixins, TemporaryTasksMixins, ScreenMapSocketMixins],
  components: {
    CommandHeader,
    CommandOperate: () => import('./modules/operate'), //功能操作区域
    MapSearch: () => import('@/components/JcMap/MapSearch'), //地图搜索
    DataOverview: () => import('./modules/dataOverview'), //左下角的数据预览
    CommandMessage: () => import('./modules/message'), //任务等消息弹窗
    ImTalk: () => import('./modules/imTalk'), //聊天消息
    CommandOrg: () => import('./modules/org'), //组织架构
    CommandGrid: () => import('./modules/grid'), //网格
    MessageDetail: () => import('./modules/messageDetail'), //消息详情
    TemporaryTasksManage: () => import('@/bundles/taskBundle/taskProcess/modules/manage'), //临时任务
    MediaLive: () => import('./modules/mediaLive') //音视频
  },
  data() {
    return {
      index: 1,
      project: { projectId: '', projectName: '', orgId: '', projectType: '' },
      messageComponent: '',
      messageOptions: null,
      viewComponent: '',
      viewOptions: null,
      viewComponentQueue: []
    }
  },
  mounted() {
    myJcMap = new JcMap()
    this.initData()
  },
  methods: {
    async initData() {
      await myJcMap.init(this.$refs.myMap) //等待地图初始化

      if (this.$route.params.projectId) {
        //处理项目，如果项目id存在则获取项目详情
        let { projectId, projectName, orgId, projectType } = await projectGet(this.$route.params.projectId)

        this.project = { projectId, projectName, orgId, projectType }
      }

      this.$EventBus.$on('view-component-change', this.viewComponentChange) //监听 内容窗口改变
      this.$EventBus.$on('view-component-back', this.viewBack) //监听 内容窗口返回
      this.$EventBus.$on('message-component-change', this.messageComponentChange) //消息 内容窗口改变
      this.$EventBus.$on('map-switch-change', this.mapSwitchChange) //地图背景切换

      this.messageComponent = 'CommandMessage'
      this.$nextTick(() => {
        this.$refs.mapSearch.initData(myJcMap) //初始化搜索对象
      })

      console.log('emit-command-init-success')
      this.$EventBus.$emit('command-init-success', this.project) //通知基础数据初始化完成
    },
    getMyJcMap() {
      return myJcMap//获取地图
    },
    getAmapBundles(clusterData) {
      //获取缩放边界
      let maxRund = 1.00004, minRund = 0.99996 //设置边距

      let lnglats = { lng: { max: null, min: null }, lat: { max: null, min: null } }

      clusterData.forEach(item => {
        if (!lnglats.lng.max || item.lnglat.lng > lnglats.lng.max) {
          lnglats.lng.max = item.lnglat.lng
        }
        if (!lnglats.lng.min || item.lnglat.lng < lnglats.lng.min) {
          lnglats.lng.min = item.lnglat.lng
        }
        if (!lnglats.lat.max || item.lnglat.lat > lnglats.lat.max) {
          lnglats.lat.max = item.lnglat.lat
        }
        if (!lnglats.lat.min || item.lnglat.lat < lnglats.lat.min) {
          lnglats.lat.min = item.lnglat.lat
        }
      })

      return new myJcMap.AMap.Bounds([lnglats.lng.min * minRund, lnglats.lat.min * minRund], [lnglats.lng.max * maxRund, lnglats.lat.max * maxRund])
    },
    viewComponentChange(data) {
      //内容窗口改变处理,如果队列中存在,则移除再添加
      for (let i = 0; i < this.viewComponentQueue.length; i++) {
        if (this.viewComponentQueue[i].component == data.component) {
          this.viewComponentQueue.splice(i, 1)
          break
        }
      }
      this.viewOptions = data.options
      this.viewComponent = data.component
      this.viewComponentQueue.push(data)
      console.log('viewComponentChange', data, this.viewComponentQueue)
    },
    messageComponentChange(data) {
      //内容窗口处理
      if (data.component == this.messageComponent) {
        this.messageComponent = ''
      } else {
        this.messageOptions = data.options
        this.messageComponent = data.component
      }
      console.log('messageComponentChange', data)
    },
    mapSwitchChange(mapStyle) {
      myJcMap.setMapStyle(mapStyle)
    },
    viewBack() {
      //view 窗口返回,处理队列中历史显示
      let index = this.viewComponentQueue.length - 1

      if (index < 1) {
        this.viewOptions = null
        this.viewComponent = ''
        this.viewComponentQueue = []
      } else {
        this.viewComponentQueue.splice(index, 1)
        let item = this.viewComponentQueue[index - 1]

        this.viewOptions = item.options
        this.viewComponent = item.component
      }
    }
  },
  beforeDestroy() {
    myJcMap.destroy()
    //去除事件监听
    this.$EventBus.$off('view-component-change', this.viewComponentChange)
    this.$EventBus.$off('view-component-back', this.viewBack)
    this.$EventBus.$off('message-component-change', this.messageComponentChange)
    this.$EventBus.$off('map-switch-change', this.mapSwitchChange) //地图背景切换
  }
}
</script>
<style lang="scss" scoped src="./css/command.scss"></style>
