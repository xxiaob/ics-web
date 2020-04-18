<template>
  <div class="jc-map-warp jc-card">
    <div class="jc-title-warp">
      <div class="jc-title-sign">组织区域</div>
      <div class="jc-controll-warp" :class="{'jc-active': edit}">
        <i class="jc-controll-item iconfont" :class="edit ? 'iconchehui' : 'iconshezhi'" @click="changeWork"></i>
        <i class="jc-controll-item iconfont iconkuaijieshezhi"></i>
        <i class="jc-controll-item iconfont iconSecondMenu-customize"></i>
      </div>
    </div>
    <auto-area></auto-area>
    <div class="jc-map-space" ref="myMap"></div>
  </div>
</template>
<script>
import JcMapUtils from '@/libs/JcMapUtil'
import { MapOptions } from '@/config/JcMapConfig'

export default {
  name: 'SystemOrganizationAreaManage',
  components: {
    AutoArea: () => import('./modules/autoArea')
  },
  mounted() {
    JcMapUtils.init({ ...MapOptions, source: this.$refs.myMap }, () => {

    })
  },
  data() {
    return {
      edit: false,
      type: 1
    }
  },
  methods: {
    changeWork() {
      this.edit = !this.edit
    }
  },
  beforeDestroy() {
    JcMapUtils.destroy() //销毁地图
  }
}
</script>
<style lang="scss" scoped>
$jc-map-header-height: 40px; //map header高度
.jc-map-warp {
  position: relative;
}
.jc-title-warp {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
  height: $jc-map-header-height;
  line-height: $jc-map-header-height;
  padding-left: $jc-default-dis;
  background-color: $jc-color-white;
}
.jc-map-space {
  position: relative;
  width: 100%;
  height: 100%;
}
.jc-controll-warp {
  position: absolute;
  right: 0;
  top: 0;
  width: $jc-map-header-height;
  background-color: $jc-color-white;
  height: $jc-map-header-height;
  overflow: hidden;
  transition: height 0.3s;
  will-change: height;
  &.jc-active {
    height: $jc-map-header-height * 3;
  }
  .jc-controll-item {
    display: block;
    text-align: center;
    width: 100%;
    cursor: pointer;
    height: $jc-map-header-height;
    &:hover,
    &.jc-active {
      color: $jc-color-primary;
    }
  }
}
</style>
