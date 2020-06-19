<template>
  <div class="eventType">
    <div class="title">
      <span>事件类型TOP3</span>
      <!-- <span class="type">事件上报</span>
      <span class="type selected">网巡上报</span> -->
    </div>
    <div class="dateType">
      <span :class="dateActive===0?'selected':''" @click="dateChange(0)">日</span>
      <span :class="dateActive===1?'selected':''" @click="dateChange(1)">周</span>
      <span :class="dateActive===2?'selected':''" @click="dateChange(2)">月</span>
    </div>
    <div class="echarts" ref="echarts"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'eventType',
  data() {
    return {
      dateActive: 0
    }
  },
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
    dateChange(v) {
      this.dateActive = v
      this.echartsChange()
    },
    echartsChange() {
      if (this.echarts) {
        const arr1 = new Array(10).fill(0)

        arr1.forEach((value, index)=>{
          arr1[index] = Math.round(50 - 20 * Math.random())
        })
        const arr2 = new Array(10).fill(0)

        arr2.forEach((value, index)=>{
          arr2[index] = Math.round(40 - 20 * Math.random())
        })
        const arr3 = new Array(10).fill(0)

        arr3.forEach((value, index)=>{
          arr3[index] = Math.round(30 - 20 * Math.random())
        })
        this.echartsOptions.series[0].data = arr1
        this.echartsOptions.series[1].data = arr2
        this.echartsOptions.series[2].data = arr3
        this.echarts.setOption(this.echartsOptions)
      }
    },
    renderEcharts() {
      this.echarts = echarts.init(this.$refs.echarts)
      this.echartsOptions = {
        // color: [ '#1772d7', '#44c2fa' ],
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
          data: [ 'TOP1', 'TOP2', 'TOP3' ],
          icon: 'circle',
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
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
            itemStyle: {
              emphasis: {
                barBorderRadius: [10, 10, 10, 10]
              },
              normal: {
                barBorderRadius: [10, 10, 10, 10],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 1,
                    color: '#12b9bb'
                  },
                  {
                    offset: 0,
                    color: '#00c39b'
                  }
                ])
              }
            },
            name: 'TOP1',
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
                    color: '#009fff'
                  },
                  {
                    offset: 0,
                    color: '#17dafb'
                  }
                ])
              }
            },
            name: 'TOP2',
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
                    color: '#faa107'
                  },
                  {
                    offset: 0,
                    color: '#feee3d'
                  }
                ])
              }
            },
            name: 'TOP3',
            type: 'bar',
            data: [13, 11, 12, 13, 14, 15, 16, 17, 18, 19 ]
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
