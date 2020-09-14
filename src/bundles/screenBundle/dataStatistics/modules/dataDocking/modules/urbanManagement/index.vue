<template>
  <!--  数字城管  -->
  <abstract-area title="数字城管">
    <div class="jc-category jc-flex-con jc-flex-warp">
      <div class="jc-category-item jc-flex-warp">
        <span class="jc-category-title">工单上报</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="869" :duration="3000" separator="" />件
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <span class="jc-category-title">工单处理</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="778" :duration="3000" separator="" />件
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <span class="jc-category-title">结案比率</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="89.50" :decimals="2" :duration="3000" separator="" />%
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <span class="jc-category-title">在线网格员</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="160" :duration="3000" separator="" />个
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
  name: 'ScreenDataStatisticsUrbanManagement',
  components: {
    abstractArea,
    countTo
  }
}
</script>
<style lang="scss" scoped>
.jc-category {
  padding-top: 0;
  .jc-category-item {
    align-items: center;
    background: url("./assets/citysummary.png") no-repeat center bottom/100%;
    background-origin: content-box;

    &:nth-child(odd) {
      padding-right: 16px;
    }
    &:nth-child(even) {
      padding-left: 16px;
    }
  }
}
</style>
