<template>
  <view-warp :title="options.deviceName" v-loading="loading">
    <view-tabs v-model="tabComponent" :options="tabs"></view-tabs>
    <keep-alive>
      <component :is="tabComponent" :deviceDetaillData="deviceDetaillData"></component>
    </keep-alive>
    <div class="jc-user-footer">
      <div class="jc-opera-item" @click="goMeeting('audio')" v-if="deviceDetaillData.deviceSource==DEVICE_SOURCES.LAW">音频指挥</div>
      <div class="jc-opera-item" @click="goMeeting('video')" v-if="deviceDetaillData.deviceSource==DEVICE_SOURCES.LAW">视频指挥</div>
      <div class="jc-opera-item" @click="devicevideoPlay">设备观摩</div>
      <div class="jc-opera-item" @click="deviceTrajectory" v-if="deviceDetaillData.deviceSource==DEVICE_SOURCES.LAW">轨迹查询</div>
    </div>
  </view-warp>
</template>
<script>
import { DEVICE_TYPES, VIDEO_INVITE_TYPES, DEVICE_SOURCES } from '@/constant/Dictionaries'
import { deviceDetail } from '@/api/device'


export default {
  name: 'ScreenCommandDeviceDetail',
  props: ['options', 'project'],
  components: {
    ViewWarp: () => import('../common/viewWarp'),
    ViewTabs: () => import('../common/viewTabs'),
    BaseInfo: () => import('./modules/baseInfo'), //基础信息
    WorkingInfo: () => import('./modules/workingInfo') // 运行信息

  },
  data() {
    return {
      DEVICE_SOURCES,
      loading: false,
      tabComponent: 'BaseInfo',
      videoTypes: VIDEO_INVITE_TYPES,
      tabs: [{ label: '基础信息', value: 'BaseInfo' }, { label: '运行信息', value: 'WorkingInfo' }],
      deviceDetaillData: []
    }
  },
  watch: {
    options() {
      this.initDeviceDetail()
    }
  },
  created() {
    // console.log('deviceDetail', this.options, this.project)
    // 初始化数据
    this.initDeviceDetail()
  },
  methods: {
    async initDeviceDetail() {
      this.loading = true

      // 获取设备id
      let { deviceId } = this.options

      try {
        // 请求数据
        let deviceDetaillData = await deviceDetail({ deviceId })


        console.log('deviceDetaillData', deviceDetaillData)

        this.deviceDetaillData = deviceDetaillData
      } catch (err) {
        console.log(err)
      }

      this.loading = false
    },
    goMeeting(talkType) {
      //去进行会议

      // 设备不在线
      console.log('this.deviceDetaillData.online', this.deviceDetaillData.online)
      if (!this.deviceDetaillData.online) {
        this.$message.error('设备不在线')
        return
      }

      // 设备不是网巡车
      // if (DEVICE_TYPES.NETPATROLCAR !== this.deviceDetaillData.deviceType) {
      //   this.$message.error('设备不是网巡车')
      //   return
      // }

      // 如果设备在线, 并且为网巡车网巡车

      this.$EventBus.$emit('screen-opera-control', { type: 'select', isSelect: false })
      this.$EventBus.$emit('screen-media-live', { users: [{ id: this.deviceDetaillData.userId, name: this.deviceDetaillData.deviceName }], type: talkType == 'video' ? VIDEO_INVITE_TYPES.MEETVIDEO : VIDEO_INVITE_TYPES.MEETAUDIO })
    },
    devicevideoPlay() {
      // 设备观摩
      // 设备不在线
      if (!this.deviceDetaillData.online) {
        this.$message.error('设备不在线')
        return
      }
      // 设备观摩
      // console.log(this.deviceDetaillData)
      this.$EventBus.$emit('device-video-play', [{ deviceId: this.deviceDetaillData.deviceId, name: this.deviceDetaillData.deviceName, hls: this.deviceDetaillData.url }])
    },
    deviceTrajectory() {
      // 设备不在线
      if (!this.deviceDetaillData.online) {
        this.$message.error('设备不在线')
        return
      }
      console.log('this.deviceDetaillData', this.deviceDetaillData)
      // 设备轨迹
      this.$EventBus.$emit('screen-user-trajectory', { id: this.deviceDetaillData.userId, name: this.deviceDetaillData.deviceName, type: this.deviceDetaillData.deviceType }) //查看用户轨迹
    }


  }
}
</script>
