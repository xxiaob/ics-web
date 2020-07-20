<template>
  <div class="jc-flex-warp chartStatistics jc-flex-vertical">
    <div class="top jc-flex-warp">
      <div class="jc-flex-con">日</div>
      <div class="jc-flex-con activated">周</div>
      <div class="jc-flex-con">月</div>
    </div>
    <jc-info class="chart-comp"></jc-info>
    <jc-area class="chart-comp"></jc-area>
    <jc-type class="chart-comp"></jc-type>
  </div>
</template>

<script>
import JcInfo from './info'
import JcArea from './area'
import JcType from './type'
export default {
  name: 'ScreenDataStatisticsChartStatistics',
  components: {
    JcInfo,
    JcArea,
    JcType
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
    /deep/ {
      .top {
        height: 40px;
        line-height: 40px;
        img {
          position: relative;
          top: 2px;
        }
        .title {
          color: rgb(139, 193, 252);
          font-size: 18px;
          font-weight: bold;
          margin-left: 10px;
        }
        .right {
          float: right;
          font-size: 12px;
          color: rgb(5, 114, 189);
          cursor: pointer;
          margin-left: $jc-default-dis/2;

          &.activated {
            color: rgb(20, 237, 252);
          }

          &:not(:last-child) {
            &::after {
              content: "";
              float: left;
              width: 1px;
              height: 14px;
              margin-right: $jc-default-dis/2;
              margin-top: 14px;
              background-color: rgb(5, 114, 189);
            }
          }
        }
      }
    }
  }
}
</style>
