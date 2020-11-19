<template>
  <!--  建筑违法  -->
  <abstract-area title="建筑违法">
    <div class="jc-category jc-flex-con jc-flex-warp">
      <!-- <div class="jc-category-item jc-flex-warp jc-build-1">
        <span class="jc-category-title">违法建筑</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="illegalConstructiondata.illegalConstruction" :duration="3000" separator="" />件
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp jc-build-2">
        <span class="jc-category-title">建筑面积</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="illegalConstructiondata.buildArea" :decimals="2" :duration="3000" separator="" />m<sup>2</sup>
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp jc-build-3">
        <span class="jc-category-title">拆除面积</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="illegalConstructiondata.demolitionArea" :decimals="2" :duration="3000" separator="" />m<sup>2</sup>
        </span>
      </div>
      <div class="jc-category-item jc-flex-warp jc-build-4">
        <span class="jc-category-title">拆除比率</span>
        <span class="jc-category-count">
          <count-to :startVal="0" :endVal="illegalConstructiondata.demolitionRatio" :decimals="2" :duration="3000" separator="" />%
        </span>
      </div> -->

      <div class="jc-category-item jc-flex-warp jc-build-4" v-for="(item,index) in illegalConstructiondata" :key="index" :class="`jc-build-${index+1}`">
        <span class="jc-category-title">{{item.cname}}</span>
        <span class="jc-category-count">
          <count-to v-if="parseInt(item.value) == parseFloat(item.value)" :startVal="0" :endVal="item.value" :duration="3000" separator="" />
          <count-to v-else :startVal="0" :endVal="item.value" :decimals="2" :duration="3000" separator="" />
          {{item.company}}
        </span>
      </div>
    </div>

  </abstract-area>
</template>
<script>
// 导入组件
import abstractArea from '../../../common/abstractArea'
import countTo from 'vue-count-to'

export default {
  name: 'ScreenDataStatisticsBuildIllegal',
  components: {
    abstractArea,
    countTo
  },
  data() {
    return {
      illegalConstructiondata: [
        {
          cname: '违法建设',
          value: 0,
          company: '起'
        },
        {
          cname: '查处面积',
          value: 0,
          company: '㎡'
        },
        {
          cname: '拆除新增',
          value: 0,
          company: '起'
        },
        {
          cname: '拆除新增',
          value: 0,
          company: '㎡'
        }
      ]
    }
  },
  created() {
    this.$EventBus.$on('data-statistics-illegal-construction', this.initIllegalConstruction)
  },
  methods: {
    initIllegalConstruction(illegalConstructiondata) {
      illegalConstructiondata.forEach((item, index) => {
        this.illegalConstructiondata[index].cname = item.cname || this.illegalConstructiondata[index].cname
        this.illegalConstructiondata[index].value = item.value || this.illegalConstructiondata[index].value
        this.illegalConstructiondata[index].company = item.company || this.illegalConstructiondata[index].company
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-category {
  position: relative;

  .jc-category-item {
    background-repeat: no-repeat;
    background-size: calc(100% - 5px) 100%;
    .jc-category-title {
      color: #ffffff;
    }

    &.jc-build-1 {
      background-image: url("./assets/building-bg1.png");
      background-position: left center;
    }
    &.jc-build-2 {
      background-image: url("./assets/building-bg2.png");
      background-position: right center;
    }
    &.jc-build-3 {
      background-image: url("./assets/building-bg3.png");
      margin-top: 10px;
      background-position: left center;
    }
    &.jc-build-4 {
      background-image: url("./assets/building-bg4.png");
      margin-top: 10px;
      background-position: right center;
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding-bottom: 16px;
    background: url("./assets/enforcement.png") no-repeat center/auto 60%;
    background-origin: content-box;
  }
}
</style>
