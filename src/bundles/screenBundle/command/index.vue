<template>
  <section class="jc-screen-warp">
    <command-header></command-header>
    <map-search ref="mapSearch" class="jc-area-search"></map-search>
    <div class="jc-screen-space" ref="myMap"></div>
    <command-operate></command-operate>
    <div class="jc-view-space" :class="{'jc-message-show': !!messageComponent}">
      <transition name="jc-view">
        <keep-alive>
          <component :is="viewComponent" :options="viewOptions"></component>
        </keep-alive>
      </transition>
    </div>
    <transition name="jc-message">
      <keep-alive>
        <component :is="messageComponent" :options="messageOptions"></component>
      </keep-alive>
    </transition>
  </section>
</template>
<script>
import { JcMap } from '@/map'

let myJcMap //个人 map 对象

export default {
  name: 'ScreenCommand',
  components: {
    CommandHeader: () => import('./modules/header'), //顶部
    CommandOperate: () => import('./modules/operate'), //功能操作区域
    MapSearch: () => import('@/components/JcMap/MapSearch'), //地图搜索
    CommandMessage: () => import('./modules/message'), //任务等消息弹窗
    ImTalk: () => import('./modules/imTalk'), //聊天消息
    CommandOrg: () => import('./modules/org'), //组织架构
    CommandGrid: () => import('./modules/grid') //网格
  },
  data() {
    return {
      index: 1,
      messageComponent: '',
      messageOptions: null,
      viewComponent: '',
      viewOptions: null
    }
  },
  mounted() {
    myJcMap = new JcMap()
    this.initData()
  },
  methods: {
    initData() {
      myJcMap.init(this.$refs.myMap).then(() => {
        this.$refs.mapSearch.initData(myJcMap) //初始化搜索对象
        this.messageComponent = 'CommandMessage'
      })
      this.$EventBus.$on('view-component-change', this.viewComponentChange) //监听 内容窗口改变
      this.$EventBus.$on('message-component-change', this.messageComponentChange) //消息 内容窗口改变
    },
    viewComponentChange(data) {
      //内容窗口改变处理
      this.viewOptions = data.options
      this.viewComponent = data.component
      console.log(data)
    },
    messageComponentChange(data) {
      //内容窗口处理
      if (data.component == this.messageComponent) {
        this.messageComponent = ''
      } else {
        this.messageOptions = data.options
        this.messageComponent = data.component
      }
    }
  },
  beforeDestroy() {
    myJcMap.destroy()
    //去除事件监听
    this.$EventBus.$off('view-component-change', this.viewComponentChange)
    this.$EventBus.$off('message-component-change', this.messageComponentChange)
  }
}
</script>
<style lang="scss" scoped src="./css/command.scss"></style>
