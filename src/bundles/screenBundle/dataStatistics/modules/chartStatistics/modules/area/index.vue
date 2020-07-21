<template>
  <div class="jc-flex-con jc-flex-warp jc-flex-vertical info">
    <div class="jc-title">
      <img class="jc-title-sign" src="@/bundles/screenBundle/dataStatistics/assets/title.png" alt="" height="18">
      <span class="jc-title-content">下辖区域占比</span>
      <div class="jc-right-box">
        <span class="jc-right-item" :class="{'jc-activated':activated===1}" @click="changeType(1)">上报事件</span>|
        <span class="jc-right-item" :class="{'jc-activated':activated===2}" @click="changeType(2)">网巡问题</span>|
        <span class="jc-right-item" :class="{'jc-activated':activated===3}" @click="changeType(3)">临时任务</span>
      </div>
    </div>
    <div class="jc-flex-con">
      <jc-charts :options="options"></jc-charts>
    </div>
  </div>
</template>

<script>
import JcCharts from '@/components/JcForm/JcCharts'
export default {
  name: 'ScreenDataStatisticsChartStatisticsArea',
  components: {
    JcCharts
  },
  props: {
    cycle: {
      type: Number
    }
  },
  data() {
    return {
      project: null,
      options: null,
      activated: 1
    }
  },
  watch: {
    cycle() {
      console.log('Area 周期变化', this.cycle)
    }
  },
  methods: {
    changeType(val) {
      if (val !== this.activated) {
        this.activated = val
      } else {
        console.log('请勿重复点击')
      }
    }
  },
  created() {
    this.options = {
      color: [ '#0041fb', '#006cff', '#0096ff', '#04e0f9', '#48f754', '#f9ff5c', '#ffba00', '#ff5d5d', '#04dcfc', '#bb55eb', '#fb2087' ],
      textStyle: {
        color: 'white',
        fontSize: 12
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 50,
        top: 20,
        bottom: 20,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 10,
        formatter: '{name}　　20%',
        // data: ['私搭乱建', '非法小广告', '绿地脏乱', '倚门出摊', '机动车乱停放'],
        textStyle: {
          color: 'rgb(139,193,252)',
          fontSize: 12
        }
      },
      series: [
        {
          name: '事件总数',
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['30%', '50%'],
          label: {
            show: false
          },
          itemStyle: {
            borderWidth: 3,
            borderColor: '#000438'
          },
          data: [
            { value: 335, name: '私搭乱建' },
            { value: 310, name: '非法小广告' },
            { value: 274, name: '绿地脏乱' },
            { value: 235, name: '倚门出摊' },
            { value: 235, name: '倚门出摊1' },
            { value: 235, name: '倚门出摊2' },
            { value: 235, name: '倚门出摊3' },
            { value: 400, name: '机动车乱停放' }
          ].sort( (a, b)=> b.value - a.value),
          // labelLine: {
          //  lineStyle: {
          //   color: 'white'
          //  },
          //  smooth: 0.2,
          //  length: 10,
          //  length2: 20
          // },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: ()=> {
            return Math.random() * 200
          }
        }
      ]
    }

    this.$EventBus.$on('data-statistics-init-success', val=>{
      console.log('info 接收信息成功', val)
      this.project = val
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
