<template>
  <div class="jc-main-full-container">

    <org-trees v-show="show==='index'" class="jc-trees-warp" @node-change="nodeChange"></org-trees>
    <div v-show="show==='index'" class="jc-trees-content">
      <device-list ref="deviceList" class="jc-main-container-warp"></device-list>
    </div>

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
    OrgTrees: () => import('@/bundles/systemBundle/organization/modules/orgTrees'),
    DeviceList: () => import('./modules/deviceList'),
    CameraVideo: () => import('./modules/cameraVideo'),
    LawVideo: () => import('./modules/lawVideo')
  },
  methods: {
    nodeChange(data) {
      console.log('设备管理，树节点change：', data)
      this.$refs.deviceList.initData(data.orgId)
    },
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

.jc-trees-warp {
  position: absolute;
  top: $jc-default-dis;
  left: $jc-default-dis;
  bottom: $jc-default-dis;
  width: $jc-trees-width;
  background-color: $jc-color-white;
  border-radius: $jc-border-radius-base;
  z-index: 1;
}

.jc-trees-content {
  position: relative;
  width: 100%;
  height: 100%;
  padding-left: $jc-trees-width + $jc-default-dis;
  overflow: auto;
  .jc-main-container-warp {
    min-width: $jc-min-width - $jc-trees-width;
  }
}
</style>
