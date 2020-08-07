<template>
  <div class="jc-case-summary jc-flex-warp">
    <jc-abstract-area title="案件概要">
      <div class="jc-case-summary-content jc-flex-con">

        <!-- 背景圈圈 -->
        <div class="jc-summary-bgwrap">
          <div class="summary-border">
          </div>
          <div class="summary-border summary-waves-2">
          </div>
          <div class="summary-border summary-waves-3">
          </div>
          <!-- 遮罩 -->
          <div class="mark"></div>
        </div>

        <!-- 整体内容区域 -->
        <div class="jc-summary-content jc-flex-warp">
          <jc-summary class="jc-flex-con" />
        </div>
      </div>
    </jc-abstract-area>
  </div>
</template>

<script>
import JcAbstractArea from '../../../common/abstractArea'
import JcSummary from './modules/summary'
export default {
  name: 'ScreenDataStatisticsDataDockingCaseSummary',
  components: { JcAbstractArea, JcSummary }
}
</script>

<style lang="scss" scoped>
.jc-case-summary {
  padding: 0 16px;

  & >>> .jc-title-wrap {
    padding: 0;
  }
  .jc-case-summary-content {
    position: relative;
    transform-style: preserve-3d;
    perspective: 1200px;
    padding: 16px;

    .jc-summary-bgwrap {
      position: relative;
      top: 50%;
      width: 100%;
      padding-top: 42%;
      transform: translate(0, -50%) rotateX(52deg);
      // background: pink;

      .summary-border {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border: 2px solid #11e7ff;
        border-radius: 50%;
        animation: waves 3s linear infinite;
      }

      .summary-waves-2 {
        animation-delay: 1s;
      }
      .summary-waves-3 {
        animation-delay: 2s;
      }

      .mark {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding-top: 22%;
        background-color: #000438;
        border-radius: 30%;
        opacity: 0.4;
      }

      @keyframes waves {
        0% {
          opacity: 0;
          transform: scale(0.7) translateY(20px);
        }
        50% {
          opacity: 1;
          transform: scale(0.85) translateY(10px);
        }
        100% {
          opacity: 0;
          transform: scale(1);
        }
      }
    }

    .jc-summary-content {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      padding-bottom: 26%;
      transform: translateY(-50%) translateZ(74px);
      z-index: 10;
    }
  }
}
</style>
