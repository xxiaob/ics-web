<template>
  <!--  智慧环卫  -->
  <abstract-area title="智慧环卫">
    <div class="jc-category jc-flex-warp">
      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/sanitation-people.png" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">在线人数</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="1468" :duration="3000" separator="" />件
          </span>
        </div>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/sanitation-vehicle.png" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">在线车辆</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="849" :duration="3000" separator="" />辆
          </span>
        </div>
      </div>

      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/sanitation-garbage.png" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">垃圾收集点</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="86" :duration="3000" separator="" />个
          </span>
        </div>
      </div>

      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/sanitation-transit.png" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">垃圾中转站</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="343" :duration="3000" separator="" />个
          </span>
        </div>
      </div>

      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/sanitation-toilet.png" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">公共厕所</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="847" :duration="3000" separator="" />个
          </span>
        </div>
      </div>
      <div class="jc-category-item jc-flex-warp">
        <div class="jc-sanitation-img">
          <img src="./assets/sanitation-classify.png" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">垃圾分类执法</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="54" :duration="3000" separator="" />件
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
  height: 100%;

  .jc-category-item {
    justify-content: center;
    width: 33%;

    .jc-sanitation-content {
      justify-content: center;
      align-items: center;

      .jc-sanitation-title {
        font-size: 14px;
        letter-spacing: 1px;
        color: #8bc1fc;
      }

      .jc-sanitation-count {
        font-size: 18px;
        letter-spacing: 1px;
        color: #11e7ff;
      }
    }
  }
}
</style>
