<template>

  <jc-abstract-area title="监控视频">
    <div class="js-monitoring-content jc-flex-warp">
      <div class="jc-monitoring-wrap">
        <div class="monitoring-wrap data-statistics-border jc-flex-warp jc-flex-vertical">
          <div class="montitoring-title">健康小区9栋朝东</div>
          <!-- 监控视频存放位置 -->
          <div class="montitoring jc-flex-con">

          </div>
        </div>
      </div>

      <div class="jc-monitoring-wrap">
        <div class="monitoring-wrap data-statistics-border jc-flex-warp jc-flex-vertical">
          <div class="montitoring-title">健康小区9栋朝东</div>
          <!-- 监控视频存放位置 -->
          <div class="montitoring jc-flex-con">

          </div>
        </div>
      </div>
      <div class="jc-monitoring-wrap">
        <div class="monitoring-wrap data-statistics-border jc-flex-warp jc-flex-vertical">
          <div class="montitoring-title">健康小区9栋朝东</div>
          <!-- 监控视频存放位置 -->
          <div class="montitoring jc-flex-con">

          </div>
        </div>
      </div>
      <div class="jc-monitoring-wrap">
        <div class="monitoring-wrap data-statistics-border jc-flex-warp jc-flex-vertical">
          <div class="montitoring-title">健康小区9栋朝东</div>
          <!-- 监控视频存放位置 -->
          <div class="montitoring jc-flex-con">

          </div>
        </div>
      </div>
    </div>
  </jc-abstract-area>

</template>

<script>
// 标题抽象组件
import JcAbstractArea from '../../../../command/abstractArea'

export default {
  name: 'ScreenDataStatisticsRealtimeContentMonitoring',
  components: {
    JcAbstractArea
  }
}
</script>

<style lang="scss" scoped>
.js-monitoring-content {
  height: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;

  .jc-monitoring-wrap {
    width: 50%;
    height: 50%;

    &:nth-child(odd) {
      padding-right: 8px;
    }
    &:nth-child(even) {
      padding-left: 8px;
    }
    &:nth-child(-n + 2) {
      padding-bottom: 6px;
    }
    &:nth-child(n + 3) {
      padding-top: 6px;
    }

    .monitoring-wrap {
      width: 100%;
      height: 100%;
      padding: 0 12px 12px;
      text-align: center;

      .montitoring-title {
        height: 38px;
        line-height: 38px;
        font-size: 16px;
        color: #11e7ff;
      }

      .montitoring {
        background: #11e7ff;
      }
    }
  }
}
</style>
