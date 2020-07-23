<template>
  <div class="smart-analy jc-flex-warp">
    <jc-abstract-area title="AI 智能分析">
      <div class="smart-analy-content jc-flex-warp jc-flex-con">

        <div class="smart-analy-left jc-flex-con-2 jc-flex-warp jc-flex-vertical">
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">占道经营</span>
            <span>
              <count-to :startVal="0" :endVal="339" /> 件
            </span>
          </div>
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">机动车乱停</span>
            <span>
              <count-to :startVal="0" :endVal="39" /> 件
            </span>
          </div>
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">乱堆物料</span>
            <span>
              <count-to :startVal="0" :endVal="39" /> 件
            </span>
          </div>
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">店外经营</span>
            <span>
              <count-to :startVal="0" :endVal="39" /> 件
            </span>
          </div>
        </div>
        <div class="smart-analy-center jc-flex-con-3">

        </div>
        <div class="smart-analy-right jc-flex-con-2 jc-flex-warp jc-flex-vertical">
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">沿街晾晒</span>
            <span>
              <count-to :startVal="0" :endVal="339" /> 件
            </span>
          </div>
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">乱拉横幅</span>
            <span>
              <count-to :startVal="0" :endVal="39" /> 件
            </span>
          </div>
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">暴露垃圾</span>
            <span>
              <count-to :startVal="0" :endVal="86" /> %
            </span>
          </div>
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">非机动车乱停</span>
            <span>
              <count-to :startVal="0" :endVal="39" /> 件
            </span>
          </div>
        </div>
      </div>
    </jc-abstract-area>
  </div>
</template>

<script>
import JcAbstractArea from '../../../common/abstractArea'
import countTo from 'vue-count-to'

export default {
  name: 'ScreenDataStatisticsOtherInfoSmartAnaly',
  components: { JcAbstractArea, countTo }
}
</script>

<style lang="scss" scoped>
.smart-analy {
  padding: 0 16px 16px;

  .smart-analy-content {
    margin-top: 10px;

    .smart-analy-center {
      margin: 0 14px;
      background: url("./assets/smartanaly-centerbg.png") no-repeat 0 0 /100% 100%;
    }

    .smart-analy-item {
      justify-content: center;
      align-items: center;
      color: #11e7ff;
      background: url("./assets/smartanaly-bg.png") no-repeat 0 0 / 100% 100%;

      &:nth-child(n + 2) {
        margin-top: 16px;
      }

      & .smart-analy-title {
        margin-right: 10px;
      }
    }
  }
}
</style>
