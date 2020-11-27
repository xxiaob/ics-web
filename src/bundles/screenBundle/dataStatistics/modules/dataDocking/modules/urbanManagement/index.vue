<template>
  <!--  数字城管  -->
  <abstract-area title="数字城管">
    <div class="jc-category jc-flex-con jc-flex-warp">

      <div class="jc-category-item jc-flex-warp" v-for="(item,index) in urbanManagementData" :key="index">
        <span class="jc-category-title">{{ item.cname }}</span>
        <span class="jc-category-count">
          <count-to v-if="parseInt(item.value) == parseFloat(item.value)" :startVal="0" :endVal="item.value" :duration="3000"  separator="" />
          <count-to v-else :startVal="0" :endVal="item.value" :duration="3000" :decimals="2"  separator="" />
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
  name: 'ScreenDataStatisticsUrbanManagement',
  components: {
    abstractArea,
    countTo
  },
  data() {
    return {
      urbanManagementData: [
        {
          cname: '工单立案',
          value: 0,
          company: '件'
        },
        {
          cname: '工单办理',
          value: 0,
          company: '件'
        },
        {
          cname: '结案比率',
          value: 0,
          company: '%'
        },
        {
          cname: '采集员',
          value: 0,
          company: '个'
        }
      ]
    }
  },
  created() {
    this.$EventBus.$on('data-statistics-urban-management', this.initUrbanManagement)
  },
  methods: {
    initUrbanManagement(urbanManagement) {
      // 数字城管模拟数据

      urbanManagement.forEach((item, index) => {
        this.urbanManagementData[index].cname = item.cname || this.urbanManagementData[index].cname
        this.urbanManagementData[index].value = item.value || this.urbanManagementData[index].value
        this.urbanManagementData[index].company = item.company || this.urbanManagementData[index].company
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-category {
  padding-top: 0;
  .jc-category-item {
    align-items: center;
    background: url("./assets/citysummary.png") no-repeat center bottom/100%;
    background-origin: content-box;

    &:nth-child(odd) {
      padding-right: 16px;
    }
    &:nth-child(even) {
      padding-left: 16px;
    }
  }
}
</style>
