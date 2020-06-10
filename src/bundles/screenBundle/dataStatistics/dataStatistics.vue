<template>
  <div class="dataStatistics">
    <div class="title">
      <span>数据统计</span>
      <span class="type" :class="active===0?'selected':''" @click="change(0)">事件上报</span>
      <span class="type" :class="active===1?'selected':''" @click="change(1)">网巡上报</span>
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
  name: 'dataStatistics',
  data() {
    return {
      active: 0,
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
    change(v) {
      this.active = v
      this.echartsChange()
    },
    dateChange(v) {
      this.dateActive = v
      this.echartsChange()
    },
    echartsChange() {
      if (this.echarts) {
        const arr1 = new Array(10).fill(0)

        arr1.forEach((value, index)=>{
          arr1[index] = Math.round(300 * Math.random())
        })
        console.log(arr1)

        const arr2 = new Array(10).fill(0)

        arr2.forEach((value, index)=>{
          arr2[index] = Math.round(300 * Math.random())
        })
        console.log(arr2)
        this.echartsOptions.series[0].data = arr1
        this.echartsOptions.series[1].data = arr2
        this.echarts.setOption(this.echartsOptions)
      }
    },
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
        // legend: {
        //   x: 'left',
        //   data: [ '正常', '异常' ],
        //   itemWidth: 12, // 设置宽度
        //   itemHeight: 8, // 设置高度
        //   itemGap: 20,
        //   left: 20,
        //   textStyle: {
        //     color: 'white',
        //     fontSize: 12
        //   }
        // },
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
            stack: '状态',
            data: [120, 132, 101, 134, 90, 230, 210, 90, 230, 90 ]
          },
          {
            barCategoryGap: '60%',
            name: '异常',
            type: 'bar',
            stack: '状态',
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
