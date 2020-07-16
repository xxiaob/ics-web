<template>
  <view-warp :title="options.userName">
    <view-tabs v-model="tabComponent" :options="tabs"></view-tabs>
    <keep-alive>
      <component :is="tabComponent" :options="options" :project="project"></component>
    </keep-alive>
    <div class="jc-user-detail-footer">
      <div class="jc-user-detail-item jc-audio" title="对讲" @click="goMediaLive(videoTypes.DOUBLEAUDIO)"></div>
      <div class="jc-user-detail-item jc-command" title="指挥" @click="goMediaLive(videoTypes.DOUBLEVIDEO)"></div>
      <div class="jc-user-detail-item jc-video" title="观摩" @click="goMediaLive(videoTypes.OBSERVE)"></div>
      <div class="jc-user-detail-item jc-force-video" title="强制观摩" @click="goMediaLive(videoTypes.FORCEOBSERVE)"></div>
      <div class="jc-user-detail-item jc-trajectory" title="轨迹" @click="userTrajectory"></div>
      <div class="jc-user-detail-item jc-screen" title="投屏"></div>
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
    WorkCheck: () =>import('./modules/workCheck'), //考勤
    UserResources: ()=> import('./modules/resources') //用户资源，目前显示一键采集的内容
  },
  data() {
    return {
      tabComponent: 'BaseInfo',
      videoTypes: VIDEO_INVITE_TYPES,
      tabs: [{ label: '基础信息', value: 'BaseInfo' }, { label: '综合', value: 'UserTask' }, { label: '考勤', value: 'WorkCheck' }, { label: '一键采集', value: 'UserResources' }]
    }
  },
  methods: {
    async goMediaLive(type) {
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
  height: 40px;
  display: flex;
  .jc-user-detail-item {
    position: relative;
    flex: 1;
    cursor: pointer;
    background-position: center;
    background-repeat: no-repeat;
    background-size: auto 50%;
    &.jc-audio {
      background-image: url(./assets/audio.png);
      &:hover {
        background-image: url(./assets/audio-on.png);
      }
    }
    &.jc-command {
      background-image: url(./assets/command.png);
      &:hover {
        background-image: url(./assets/command-on.png);
      }
    }
    &.jc-video {
      background-image: url(./assets/video.png);
      &:hover {
        background-image: url(./assets/video-on.png);
      }
    }
    &.jc-force-video {
      background-image: url(./assets/force-video.png);
      &:hover {
        background-image: url(./assets/force-video-on.png);
      }
    }
    &.jc-trajectory {
      background-image: url(./assets/trajectory.png);
      &:hover {
        background-image: url(./assets/trajectory-on.png);
      }
    }
    &.jc-screen {
      background-image: url(./assets/screen.png);
      &:hover {
        background-image: url(./assets/screen-on.png);
      }
    }
  }
}
</style>
