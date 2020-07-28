<template>
  <!--  建筑违法  -->
  <abstract-area title="建筑违法">
    <div class="jc-category jc-flex-warp">
      <div class="jc-category-item jc-flex-warp">
        <span class="jc-category-title">违法建筑</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="2384" :duration="3000" separator="" />件
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <span class="jc-category-title">建筑面积</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="1600" :duration="3000" separator="" />m<sup>2</sup>
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <span class="jc-category-title">拆除面积</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="1000" :duration="3000" separator="" />m<sup>2</sup>
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <span class="jc-category-title">拆除比率</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="1000/1600*100" :decimals="2" :duration="3000" separator="" />%
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
    background: url("./assets/building-bg.png") no-repeat center/100% 100%;
    background-origin: content-box;

    &:nth-child(odd) {
      padding-right: 5px;
    }
    &:nth-child(even) {
      padding-left: 5px;
    }
    &:nth-child(n + 3) {
      padding-top: 6px;
    }
    &:nth-child(-n + 2) {
      padding-bottom: 6px;
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
