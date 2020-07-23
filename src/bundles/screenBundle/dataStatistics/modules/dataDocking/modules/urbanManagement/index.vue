<template>
  <!--  数字城管  -->
  <abstract-area title="数字城管">
    <div class="jc-category jc-flex-warp">
      <div class="jc-category-item jc-flex-warp">
        <span class="jc-category-title">工单上报</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="2384" :duration="3000" separator="" />件
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <span class="jc-category-title">工单处理</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="2384" :duration="3000" separator="" />件
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <span class="jc-category-title">结案比率</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="2384" :duration="3000" separator="" />件
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <span class="jc-category-title">在线网格员</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="2384" :duration="3000" separator="" />件
        </span>
      </div>

    </div>

  </abstract-area>
</template>
<script>
// 导入组件
import abstractArea from '../../../../command/abstractArea'

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
  .jc-category-item {
    background: url("./assets/citysummary.png") no-repeat center/100%;
    background-origin: content-box;

    &:nth-child(odd) {
      padding-right: 16px;
    }
    &:nth-child(even) {
      padding-left: 16px;
    }

    span {
      padding-bottom: 24px;
    }
  }
}
</style>
