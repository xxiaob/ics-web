<template>
  <div class="jc-main-full-container">

    <device-list v-show="show==='index'" ref="deviceList" class="jc-main-container-warp"></device-list>

    <camera-video v-show="show==='camera'" :detail="cameraDetail"></camera-video>

    <law-video v-show="show==='law'" :detail="lawDetail"></law-video>

  </div>
</template>
<script>
export default {
  name: 'SystemDeviceIndex',
  data() {
    return {
      show: 'index',
      cameraDetail: {},
      lawDetail: {}
    }
  },
  components: {
    DeviceList: () => import('./modules/deviceList'),
    CameraVideo: () => import('./modules/cameraVideo'),
    LawVideo: () => import('./modules/lawVideo')
  },
  methods: {
    checkShow(type, detail) {
      console.log('checkShow', type)
      if (type === 'camera') {
        this.cameraDetail = detail
      } else if (type === 'law') {
        this.lawDetail = detail
      }
      this.show = type
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-main-full-container {
  overflow: auto;
}
</style>
