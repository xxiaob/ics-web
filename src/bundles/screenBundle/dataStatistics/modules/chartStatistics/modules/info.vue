<template>
  <div class="jc-flex-con jc-flex-warp jc-flex-vertical info">
    <div class="jc-title">
      <img src="../../../assets/title.png" alt="" height="18">
      <span class="title">信息累计</span>
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
import echarts from 'echarts'
import JcCharts from '@/components/JcForm/JcCharts'
export default {
  name: 'ScreenDataStatisticsChartStatisticsInfo',
  components: {
    JcCharts
  },
  data() {
    return {
      options: {
      // color: [ '#1772d7', '#44c2fa' ],
        textStyle: {
          color: 'rgb(139,192,252)',
          fontSize: 10
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          x: 'right',
          data: [ '新建问题', '已经处理', '转成任务' ],
          // icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          itemGap: 20,
          right: 20,
          textStyle: {
            color: 'rgb(139,193,252)',
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
                type: 'dotted',
                color: 'rgb(32,73,154)'
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            itemStyle: {
              emphasis: {
                barBorderRadius: [10, 10, 10, 10]
              },
              normal: {
                barBorderRadius: [10, 10, 10, 10],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 1,
                    color: '#21ddc5'
                  },
                  {
                    offset: 0,
                    color: '#0e9ab2'
                  }
                ])
              }
            },
            name: '新建问题',
            type: 'bar',
            data: [53, 51, 52, 53, 54, 55, 56, 57, 58, 59 ]
          },
          {
            itemStyle: {
              emphasis: {
                barBorderRadius: [10, 10, 10, 10]
              },
              normal: {
                barBorderRadius: [10, 10, 10, 10],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 1,
                    color: '#02b5ee'
                  },
                  {
                    offset: 0,
                    color: '#005fc6'
                  }
                ])
              }
            },
            name: '已经处理',
            type: 'bar',
            data: [33, 31, 32, 33, 34, 35, 36, 37, 38, 39 ]
          },
          {
            itemStyle: {
              emphasis: {
                barBorderRadius: [10, 10, 10, 10]
              },
              normal: {
                barBorderRadius: [10, 10, 10, 10],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 1,
                    color: '#baad42'
                  },
                  {
                    offset: 0,
                    color: '#7a8b28'
                  }
                ])
              }
            },
            name: '转成任务',
            type: 'bar',
            data: [13, 11, 12, 13, 14, 15, 16, 17, 18, 19 ]
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
