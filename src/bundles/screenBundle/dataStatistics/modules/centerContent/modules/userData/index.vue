<template>
  <div class="jc-flex-warp jc-data-warp">
    <div class="jc-data-item" v-for="item in list" :key="item.key" :class="item.icon">
      <div class="jc-data-title">
        <countTo :startVal="item.start" :endVal="item.end" :duration="duration"></countTo>{{item.unit}}
      </div>
      <div class="jc-data-subtitle" v-text="item.name"></div>
    </div>
  </div>
</template>
<script>
import countTo from 'vue-count-to'

export default {
  name: 'ScreenDataCenterContentUserData',
  components: { countTo },
  data() {
    return {
      list: [{ icon: 'jc-car', unit: '辆', name: '网巡车辆', key: 'first', start: 32, end: 38 },
        { icon: 'jc-camera', unit: '个', name: '视频监控', key: 'second', start: 32, end: 38 },
        { icon: 'jc-uav', unit: '个', name: '无人机', key: 'three', start: 32, end: 38 },
        { icon: 'jc-sgg', unit: '个', name: '市管岗', key: 'four', start: 32, end: 38 },
        { icon: 'jc-hxg', unit: '个', name: '护学岗', key: 'five', start: 32, end: 38 },
        { icon: 'jc-zha', unit: '个', name: '渣土卡点', key: 'six', start: 32, end: 38 }],
      duration: 4000
    }
  },
  created() {

  }
}
</script>
<style lang="scss" scoped>
.jc-data-warp {
  position: relative;
  padding: $jc-default-dis/2 $jc-default-dis;
}
.jc-data-item {
  flex: 1;
  position: relative;
  background-position: left center;
  background-repeat: no-repeat;
  background-size: auto 60px;
  height: 100px;
  padding: 20px 0 20px 66px;
  &.jc-camera {
    background-image: url(./assets/camera.png);
  }
  &.jc-car {
    background-image: url(./assets/car.png);
  }
  &.jc-hxg {
    background-image: url(./assets/hxg.png);
  }
  &.jc-sgg {
    background-image: url(./assets/sgg.png);
  }
  &.jc-uav {
    background-image: url(./assets/uav.png);
  }
  &.jc-zha {
    background-image: url(./assets/zha.png);
  }
  .jc-data-title {
    font-size: 24px;
    color: $jc-color-white;
    height: 36px;
    line-height: 36px;
  }
  .jc-data-subtitle {
    color: #8bc1fc;
    font-size: 14px;
  }
}
</style>
