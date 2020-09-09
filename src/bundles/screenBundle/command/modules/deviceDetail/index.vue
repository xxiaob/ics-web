<template>
  <view-warp :title="options.deviceName" v-loading="loading">
    <view-tabs v-model="tabComponent" :options="tabs"></view-tabs>
    <keep-alive>
      <component :is="tabComponent" :deviceDetaillData="deviceDetaillData"></component>
    </keep-alive>
    <div class="jc-user-footer">
      <div class="jc-opera-item">音频指挥</div>
      <div class="jc-opera-item">视频指挥</div>
      <div class="jc-opera-item">设备观摩</div>
      <div class="jc-opera-item">轨迹查询</div>
    </div>
  </view-warp>
</template>
<script>
import { VIDEO_INVITE_TYPES } from '@/constant/Dictionaries'
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
    }
  }
}
</script>
