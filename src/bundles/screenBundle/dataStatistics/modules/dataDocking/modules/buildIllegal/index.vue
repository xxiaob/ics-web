<template>
  <!--  建筑违法  -->
  <abstract-area title="建筑违法">
    <div class="jc-category jc-flex-con jc-flex-warp">
      <div class="jc-category-item jc-flex-warp jc-build-1">
        <span class="jc-category-title">违法建筑</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="25" :duration="3000" separator="" />件
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp jc-build-2">
        <span class="jc-category-title">建筑面积</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="610.5" :duration="3000" separator="" />m<sup>2</sup>
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp jc-build-3">
        <span class="jc-category-title">拆除面积</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="478.5" :duration="3000" separator="" />m<sup>2</sup>
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp jc-build-4">
        <span class="jc-category-title">拆除比率</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="78.3" :decimals="2" :duration="3000" separator="" />%
        </span>
      </div>
    </div>

  </abstract-area>
</template>
<script>
// 导入组件
import abstractArea from '../../../common/abstractArea'
import countTo from 'vue-count-to'

export default {
  name: 'ScreenDataStatisticsBuildIllegal',
  components: {
    abstractArea,
    countTo
  }
}
</script>
<style lang="scss" scoped>
.jc-category {
  position: relative;

  .jc-category-item {
    background-repeat: no-repeat;
    background-size: calc(100% - 5px) 100%;
    .jc-category-title {
      color: #ffffff;
    }

    &.jc-build-1 {
      background-image: url("./assets/building-bg1.png");
      background-position: left center;
    }
    &.jc-build-2 {
      background-image: url("./assets/building-bg2.png");
      background-position: right center;
    }
    &.jc-build-3 {
      background-image: url("./assets/building-bg3.png");
      margin-top: 10px;
      background-position: left center;
    }
    &.jc-build-4 {
      background-image: url("./assets/building-bg4.png");
      margin-top: 10px;
      background-position: right center;
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding-bottom: 16px;
    background: url("./assets/enforcement.png") no-repeat center/auto 60%;
    background-origin: content-box;
  }
}
</style>
