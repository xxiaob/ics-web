<template>
  <!--  智慧环卫  -->
  <abstract-area title="智慧环卫">
    <div class="jc-category jc-flex-warp">
      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/sanitation-people.png" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title jc-flex-con">在线人数</span>
          <span class="jc-sanitation-count jc-flex-con">
            <count-to :startVal="0" :endVal="0" :duration="3000" separator="" />人
          </span>
        </div>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/sanitation-vehicle.png" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">在线车辆</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="0" :duration="3000" separator="" />辆
          </span>
        </div>
      </div>

      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/sanitation-garbage.png" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">垃圾收集点</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="0" :duration="3000" separator="" />个
          </span>
        </div>
      </div>

      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/sanitation-transit.png" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">垃圾中转站</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="0" :duration="3000" separator="" />个
          </span>
        </div>
      </div>

      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/sanitation-toilet.png" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">公共厕所</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="0" :duration="3000" separator="" />个
          </span>
        </div>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/sanitation-classify.png" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">垃圾分类执法</span>
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

    .jc-sanitation-img {
      width: 40px;
    }

    .jc-sanitation-content {
      justify-content: center;
      align-items: flex-start;
      padding-left: 14px;

      .jc-sanitation-title {
        font-size: 12px;
        letter-spacing: 1px;
        color: #8bc1fc;
      }

      .jc-sanitation-count {
        font-size: 16px;
        letter-spacing: 1px;
        margin-top: 6px;
        color: #11e7ff;
      }
    }
  }
}
</style>
