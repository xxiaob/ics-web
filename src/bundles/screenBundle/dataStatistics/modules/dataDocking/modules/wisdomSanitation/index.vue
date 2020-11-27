<template>
  <!--  智慧环卫 改 渣土管控  -->
  <abstract-area title="渣土管控">
    <div class="jc-category jc-flex-warp">

      <div class="jc-category-item jc-flex-warp" v-for="(item, index) in residueControlData" :key="index">
        <div class="jc-sanitation-img">
          <img :src="item.src" width="100%" alt="">
        </div>
        <div class="jc-sanitation-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <span class="jc-sanitation-title">{{ item.cname }}</span>
          <span class="jc-sanitation-count">
            <count-to :startVal="0" :endVal="item.value" :duration="3000" separator="" />{{item.company}}
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
  },
  data() {
    return {
      residueControlData: [
        {
          cname: '总出土量',
          src: require('./assets/dregs-unearthed.png'),
          value: 0,
          company: '万方'
        },
        {
          cname: '出土工地',
          src: require('./assets/dregs-construction.png'),
          value: 0,
          company: '个'
        }, {
          cname: '消纳场',
          src: require('./assets/dregs-absorption.png'),
          value: 0,
          company: '个'
        }, {
          cname: '检测报警',
          src: require('./assets/dregs-warning.png'),
          value: 0,
          company: '个'
        }, {
          cname: '卡点',
          src: require('./assets/dregs-bayonet.png'),
          value: 0,
          company: '个'
        }, {
          cname: '违法案件',
          src: require('./assets/dregs-case.png'),
          value: 0,
          company: '件'
        }
      ]
    }
  },
  created() {
    this.$EventBus.$on('data-statistics-residue-control', this.initResidueControl)
  },
  methods: {
    initResidueControl(residueControlData) {
      residueControlData.forEach((item, index) => {
        this.residueControlData[index].cname = item.cname || this.residueControlData[index].cname
        this.residueControlData[index].value = item.value || this.residueControlData[index].value
        this.residueControlData[index].company = item.company || this.residueControlData[index].company
      })
    }
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
