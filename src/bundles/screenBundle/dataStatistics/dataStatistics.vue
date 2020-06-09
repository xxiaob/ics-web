<template>
  <div class="dataStatistics">
    <div class="title">
      <span>数据统计</span>
      <span class="type">事件上报</span>
      <span class="type selected">网巡上报</span>
    </div>
    <div class="dateType">
      <span>日</span>
      <span class="selected">周</span>
      <span>月</span>
    </div>
    <div class="echarts" ref="echarts"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'dataStatistics',
  mounted() {
    this.renderEcharts()

    window.addEventListener('resize', () => {
      console.log('echarts resize')
      if (this.echarts) {
        this.echarts.resize()
      }
    })
  },
  methods: {
    renderEcharts() {
      this.echarts = echarts.init(this.$refs.echarts)
      this.echartsOptions = {
        color: [ '#1772d7', '#44c2fa' ],
        textStyle: {
          color: 'white',
          fontSize: 12
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          x: 'left',
          data: [ '正常', '异常' ],
          itemWidth: 12, // 设置宽度
          itemHeight: 8, // 设置高度
          itemGap: 20,
          left: 20,
          textStyle: {
            color: 'white',
            fontSize: 12
          }
        },
        grid: {
          top: 35,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            data: ['雨花', '秦淮', '鼓楼', '玄武', '建邺', '江宁', '溧水', '六合', '高淳', '栖霞']
          }
        ],
        yAxis: [
          {
            type: 'value',
            show: true,
            boundaryGap: [0, 0.01],
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            barCategoryGap: '60%',
            name: '正常',
            type: 'bar',
            stack: '广告',
            data: [120, 132, 101, 134, 90, 230, 210, 90, 230, 90 ]
          },
          {
            barCategoryGap: '60%',
            name: '异常',
            type: 'bar',
            stack: '广告',
            data: [220, 182, 191, 234, 290, 330, 310, 330, 310, 90]
          }
        ]
      }
      this.echarts.setOption(this.echartsOptions)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
