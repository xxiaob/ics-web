<template>
  <div class="jc-flex-con jc-flex-warp jc-flex-vertical info">
    <div class="jc-title">
      <!-- <img class="jc-title-sign" src="@/bundles/screenBundle/dataStatistics/assets/title.png" alt="" height="18"> -->
      <span class="jc-title-content">信息累计</span>
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
import echarts from 'echarts'
import JcCharts from '@/components/JcForm/JcCharts'

export default {
  name: 'ScreenDataStatisticsChartStatisticsInfo',
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
      console.log('info 周期变化', this.cycle)
      // this.options.series[0].data = [153, 151, 152, 153, 154, 155, 156, 157, 158, 159 ]
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
          data: []
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
          data: []
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
          data: []
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
          data: []
        }
      ]
    }

    this.$EventBus.$on('data-statistics-init-success', val=>{
      console.log('info 接收信息成功', val)
      this.project = val

      const xAxisData = ['雨花', '秦淮', '鼓楼', '玄武', '建邺', '江宁', '溧水', '六合', '高淳', '栖霞']
      const series0Data = [53, 51, 52, 53, 54, 55, 56, 57, 58, 59 ]
      const series1Data = [33, 31, 32, 33, 34, 35, 36, 37, 38, 39 ]
      const series2Data = [13, 11, 12, 13, 14, 15, 16, 17, 18, 19 ]

      this.options.xAxis[0].data = xAxisData
      this.options.series[0].data = series0Data
      this.options.series[1].data = series1Data
      this.options.series[2].data = series2Data
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
