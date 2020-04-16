<template>
  <div class="jc-map-warp jc-card">
    <div class="jc-title" title="组织区域">组织区域</div>
    <div class="jc-map-space" ref="myMap"></div>
  </div>
</template>
<script>
import JcMapUtils from '@/libs/JcMapUtil'
import { MapOptions } from '@/config/JcMapConfig'

export default {
  name: 'SystemOrganizationAreaManage',
  mounted() {
    JcMapUtils.init({ ...MapOptions, source: this.$refs.myMap }, () => {

    })
  }
}
</script>
<style lang="scss" scoped>
.jc-map-warp {
  position: relative;
}
.jc-title {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  height: 30px;
  line-height: 30px;
  width: 100px;
  text-align: center;
}
.jc-map-space {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
