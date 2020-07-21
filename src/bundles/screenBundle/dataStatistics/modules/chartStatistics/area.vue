<template>
  <div class="jc-flex-con jc-flex-warp jc-flex-vertical info">
    <div class="jc-title">
      <img src="../../assets/title.png" alt="" height="18">
      <span class="title">下辖区域占比</span>
      <span class="right">临时任务</span>
      <span class="right activated">网巡问题</span>
      <span class="right">上报事件</span>
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
  data() {
    return {
      options: {
        color: [ '#409eff', '#51cefc', '#20a867', '#e7fc01', '#fcbe01', '#ff7140', '#fd5503', '#e22d14', '#04dcfc', '#bb55eb', '#fb2087' ],
        textStyle: {
          color: 'white',
          fontSize: 12
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['私搭乱建', '非法小广告', '绿地脏乱', '倚门出摊', '机动车乱停放'],
          textStyle: {
            color: 'rgb(139,193,252)',
            fontSize: 12
          }
        },
        series: [
          {
            name: '事件总数',
            type: 'pie',
            radius: ['25%', '65%'],
            center: ['50%', '50%'],
            label: {
              show: false
            },
            data: [
              { value: 335, name: '私搭乱建' },
              { value: 310, name: '非法小广告' },
              { value: 274, name: '绿地脏乱' },
              { value: 235, name: '倚门出摊' },
              { value: 400, name: '机动车乱停放' }
            ].sort( (a, b)=> b.value - a.value),
            roseType: 'radius',
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
    }
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
</style>
