<template>
  <!--  智慧环卫 改 渣土管控  -->
  <abstract-area title="渣土管控">
    <div class="jc-category jc-flex-warp">
      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/dregs-unearthed.png" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title jc-flex-con">总出土量</span>
          <span class="jc-sanitation-count jc-flex-con">
            <count-to :startVal="0" :endVal="0" :duration="3000" separator="" />万方
          </span>
        </div>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/dregs-construction.png" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">出土工地</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="0" :duration="3000" separator="" />个
          </span>
        </div>
      </div>

      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/dregs-absorption.png" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">消纳场</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="0" :duration="3000" separator="" />个
          </span>
        </div>
      </div>

      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/dregs-warning.png" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">检测报警</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="0" :duration="3000" separator="" />个
          </span>
        </div>
      </div>

      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/dregs-bayonet.png" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">卡点</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="0" :duration="3000" separator="" />个
          </span>
        </div>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/dregs-case.png" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">违法案件</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="0" :duration="3000" separator="" />件
          </span>
        </div>
      </div>

    </div>

  </abstract-area>
</template>
<script>
// 导入组件
import abstractArea from '../../../common/abstractArea'
import countTo from 'vue-count-to'

export default {
  name: 'ScreenDataStatisticsWisdomSanitation',
  components: {
    abstractArea,
    countTo
  }
}
</script>
<style lang="scss" scoped>
.jc-category {
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 16px 16px;

  .jc-category-item {
    justify-content: center;
    width: 33%;
    padding: 10px 10px 0;
    font-weight: bold;

    .jc-sanitation-img {
      width: 40px;
    }

    .jc-sanitation-content {
      justify-content: center;
      align-items: flex-start;
      padding-left: 14px;

      .jc-sanitation-title {
        letter-spacing: 1px;
        color: #8bc1fc;
      }

      .jc-sanitation-count {
        font-size: 18px;
        letter-spacing: 1px;
        margin-top: 6px;
        color: #ffffff;
      }
    }
  }
}
</style>
