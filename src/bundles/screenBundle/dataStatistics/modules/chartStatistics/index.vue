<template>
  <div class="jc-flex-warp chartStatistics jc-flex-vertical">
    <div class="top jc-flex-warp">
      <div class="jc-flex-con" :class="{activated:activated===1}" @click="changeCycle(1)">日</div>
      <div class="jc-flex-con" :class="{activated:activated===7}" @click="changeCycle(7)">周</div>
      <div class="jc-flex-con" :class="{activated:activated===30}" @click="changeCycle(30)">月</div>
    </div>
    <jc-info class="chart-comp" :cycle="activated"></jc-info>
    <jc-area class="chart-comp" :cycle="activated"></jc-area>
    <jc-type class="chart-comp" :cycle="activated"></jc-type>
  </div>
</template>

<script>
import JcInfo from './modules/info'
import JcArea from './modules/area'
import JcType from './modules/type'
export default {
  name: 'ScreenDataStatisticsChartStatistics',
  components: {
    JcInfo,
    JcArea,
    JcType
  },
  data() {
    return {
      activated: 1
    }
  },
  methods: {
    changeCycle(val) {
      if (val !== this.activated) {
        this.activated = val
      } else {
        console.log('请勿重复点击')
      }
    }
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

  .chart-comp {
    padding: 0 $jc-default-dis $jc-default-dis/2;
    box-sizing: border-box;
    &:not(:last-child) {
      border-bottom: 1px solid rgb(32, 73, 154);
    }
  }
}
</style>
