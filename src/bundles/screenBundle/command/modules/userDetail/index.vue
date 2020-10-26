<template>
  <view-warp :title="options.userName">
    <view-tabs v-model="tabComponent" :options="tabs"></view-tabs>
    <keep-alive>
      <component :is="tabComponent" :options="options" :project="project"></component>
    </keep-alive>
    <div class="jc-user-detail-footer">
      <div class="jc-user-detail-item" @click="goMediaLive(videoTypes.DOUBLEAUDIO)">音频指挥</div>
      <div class="jc-user-detail-item" @click="goMediaLive(videoTypes.DOUBLEVIDEO)">视频指挥</div>
      <div class="jc-user-detail-item" @click="goMediaLive(videoTypes.OBSERVE)">采集观摩</div>
      <div class="jc-user-detail-item" @click="goMediaLive(videoTypes.FORCEOBSERVE)">强制观摩</div>
      <div class="jc-user-detail-item" @click="userTrajectory">轨迹</div>
      <!-- <div class="jc-user-detail-item">投屏</div> -->
    </div>
  </view-warp>
</template>
<script>
import { VIDEO_INVITE_TYPES } from '@/constant/Dictionaries'
import { getChannelByUserId } from '@/api/live'

export default {
  name: 'ScreenCommandUserDetail',
  props: ['options', 'project'],
  components: {
    ViewWarp: () => import('../common/viewWarp'),
    ViewTabs: () => import('../common/viewTabs'),
    BaseInfo: () => import('./modules/baseInfo'), //基础信息
    UserTask: () => import('./modules/task'), //任务 问题 事件
    WorkCheck: () => import('./modules/workCheck'), //考勤
    UserResources: () => import('./modules/resources') //用户资源，目前显示一键采集的内容
  },

  data() {
    return {
      tabComponent: 'BaseInfo',
      videoTypes: VIDEO_INVITE_TYPES,
      tabs: [{ label: '基础信息', value: 'BaseInfo' }, { label: '综合业务', value: 'UserTask' }, { label: '考勤信息', value: 'WorkCheck' }, { label: '一键采集', value: 'UserResources' }]
    }
  },
  methods: {
    async goMediaLive(type) {
      console.log('用户详情', this.options)
      if (!this.options.center && !this.options.online) {
        // 人员不在线
        this.$message.error('人员不在线')
        return
      }
      if (type == VIDEO_INVITE_TYPES.OBSERVE) {
        //如果是观摩，则取查询观摩的房间号，如果房间号不存在，则不能观摩
        try {
          let res = await getChannelByUserId({ userId: this.options.userId })

          if (res && res.channelName) {
            this.$EventBus.$emit('screen-media-live', { users: [{ id: this.options.userId, name: this.options.userName }], type, channelId: res.channelName })
          } else {
            this.$message.error('当前用户未在采集中')
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        this.$EventBus.$emit('screen-media-live', { users: [{ id: this.options.userId, name: this.options.userName }], type })
      }
    },
    userTrajectory() {
      this.$EventBus.$emit('screen-user-trajectory', { id: this.options.userId, name: this.options.userName }) //查看用户轨迹
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-user-detail-footer {
  position: relative;
  display: flex;
  .jc-user-detail-item {
    flex: 1;
    cursor: pointer;
    margin: 12px 0;
    height: 20px;
    color: $jc-color-text-secondary;
    font-size: $jc-font-size-smaller;
    @include jc-vhcenter;
    border-right: solid 1px $jc-color-line-primary;
    &:last-child {
      border-right: none;
    }

    &:hover {
      color: $jc-color-primary;
    }
  }
}
</style>
