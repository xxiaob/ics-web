<template>
  <div class="jc-view-content" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-detail-warp">
      <div class="jc-detail-label">在线状态：</div>
      <div class="jc-detail-content" v-text="deviceDetaillData && deviceDetaillData.online ? '在线':'离线'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">位置信息：</div>
      <div class="jc-detail-content" v-text="deviceDetaillData && deviceDetaillData.positionName || '--'"></div>
    </div>
    <div class="jc-detail-warp" v-if="deviceDetaillData && deviceDetaillData.online">
      <div class="jc-detail-label">视频信息：</div>
      <div class="jc-detail-content">
        <i class="iconfont iconshipin" @click="videoplay"></i>
      </div>

    </div>
  </div>
</template>
<script>


export default {
  name: 'ScreenCommandDeviceDetailWorkingInfo',
  props: ['deviceDetaillData'],
  data() {
    return {

    }
  },
  methods: {
    videoplay(deviceDetaillData) {
      let { deviceName, deviceId } = deviceDetaillData

      this.$EventBus.$emit('device-video-play', [{ deviceName, deviceId }])
    }
  }
}
</script>
