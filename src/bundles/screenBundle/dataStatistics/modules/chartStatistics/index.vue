<template>
  <div class="jc-flex-warp chartStatistics jc-flex-vertical">
    <div class="top jc-flex-warp">
      <div class="jc-flex-con">日</div>
      <div class="jc-flex-con activated">周</div>
      <div class="jc-flex-con">月</div>
    </div>
    <jc-info></jc-info>
    <div class="jc-flex-con">2</div>
    <div class="jc-flex-con">3</div>
  </div>
</template>

<script>
import JcInfo from './info'
export default {
  name: 'ScreenDataStatisticsChartStatistics',
  components: {
    JcInfo
  }
}
</script>

<style lang="scss" scoped>
.chartStatistics {
  border: 1px solid rgb(32, 73, 154);
  box-shadow: inset 0 0 10px 0 rgb(32, 73, 154);

  .top {
    height: 40px;
    color: rgb(5, 114, 189);
    text-align: center;
    line-height: 40px;
    border-bottom: 1px solid rgb(32, 73, 154);

    & > div {
      cursor: pointer;
    }

    .activated {
      background: rgb(3, 60, 147);
      color: white;
    }
  }
}
</style>
