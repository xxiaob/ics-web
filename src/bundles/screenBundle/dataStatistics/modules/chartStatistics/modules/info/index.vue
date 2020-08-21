<template>
  <div class="jc-flex-con jc-flex-warp jc-flex-vertical info">
    <div class="jc-title">
      <span class="jc-title-content">信息累计</span>
      <div class="jc-right-box">
        <span class="jc-right-item" :class="{'jc-activated':activated===1}" @click="changeType(1)">上报事件</span>|
        <span class="jc-right-item" :class="{'jc-activated':activated===2}" @click="changeType(2)">网巡问题</span>|
        <span class="jc-right-item" :class="{'jc-activated':activated===3}" @click="changeType(3)">临时任务</span>
      </div>

    </div>
    <div class="jc-flex-con">
      <jc-charts :options="options" :isClear="true"></jc-charts>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import JcCharts from '@/components/JcForm/JcCharts'
import intervalMixin from '../../mixins/intervalMixin'

const options = {
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
  color: ['#1cccc0'],
  legend: {
    x: 'right',
    // data: [ '新建问题', '已经处理', '转成任务' ],
    // icon: 'circle',
    itemWidth: 10, // 设置宽度
    itemHeight: 10, // 设置高度
    itemGap: 20,
    right: 20,
    selectedMode: false,
    textStyle: {
      color: 'rgb(139,193,252)',
      fontSize: 12
    }
  },
  grid: {
    top: 35,
    left: 0,
    right: 0,
    bottom: -10,
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        show: false
      },
      data: [],
      axisLine: {
        show: false
      },
      axisLabel: {
        interval: 0,
        rotate: -30,
        fontSize: 10
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      max: 'dataMax',
      minInterval: 1,
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
      },
      axisLine: {
        show: false
      }
    }
  ],
  dataZoom: [
    {
      type: 'inside',
      // zoomOnMouseWheel: false,
      startValue: 0,

      // maxValueSpan: 5,
      // endValue: 3
      maxValueSpan: 11,
      endValue: 7
    }
  ],
  series: []
}
const series1 = {
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
  barWidth: 16,
  data: []
}

const series1pictorialBar = {
  tooltip: {
    show: false
  },
  type: 'pictorialBar',
  itemStyle: {
    normal: {
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0,
        [
          { offset: 0, color: '#16f1f6' },
          { offset: 1, color: '#00f8b3' }
        ]
      )
    }
  },
  symbol: 'circle',
  symbolSize: ['16', '10'],
  symbolPosition: 'end',
  data: [],
  z: 4
}

const series1pictorialBar2 = {
  tooltip: {
    show: false
  },
  type: 'pictorialBar',
  itemStyle: {
    normal: {
      color: '#13acb7'
    }
  },
  symbol: 'circle',
  symbolSize: ['16', '10'],
  symbolPosition: 'start',
  data: [],
  z: 3
}

const series2 = {
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
  barWidth: 16,
  data: []
}

const series3 = {
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
  barWidth: 16,
  data: []
}

const pictorialBarLeft1 = {
  tooltip: {
    show: false
  },
  type: 'pictorialBar',
  itemStyle: {
    normal: {
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0,
        [
          { offset: 0, color: '#16f1f6' },
          { offset: 1, color: '#00f8b3' }
        ]
      )
    }
  },
  symbol: 'circle',
  symbolSize: ['16', '10'],
  symbolOffset: ['-130%', 0],
  symbolPosition: 'end',
  data: [],
  z: 4
}

const pictorialBarLeft2 = {
  tooltip: {
    show: false
  },
  type: 'pictorialBar',
  itemStyle: {
    normal: {
      color: '#13acb7'
    }
  },
  symbol: 'circle',
  symbolSize: ['16', '10'],
  symbolOffset: ['-130%', 0],
  symbolPosition: 'start',
  data: [],
  z: 3
}

const pictorialBarMiddle1 = {
  tooltip: {
    show: false
  },
  type: 'pictorialBar',
  itemStyle: {
    normal: {
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0,
        [
          { offset: 0, color: '#1ca2ff' },
          { offset: 1, color: '#00e9fc' }
        ]
      )
    }
  },
  symbol: 'circle',
  symbolSize: ['16', '10'],
  // symbolOffset: ['-130%', 0],
  symbolPosition: 'end',
  data: [],
  z: 4
}

const pictorialBarMiddle2 = {
  tooltip: {
    show: false
  },
  type: 'pictorialBar',
  itemStyle: {
    normal: {
      color: '#007aff'
    }
  },
  symbol: 'circle',
  symbolSize: ['16', '10'],
  // symbolOffset: ['-130%', 0],
  symbolPosition: 'start',
  data: [],
  z: 3
}

const pictorialBarRight1 = {
  tooltip: {
    show: false
  },
  type: 'pictorialBar',
  itemStyle: {
    normal: {
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0,
        [
          { offset: 0, color: '#ced545' },
          { offset: 1, color: '#caa12d' }
        ]
      )
    }
  },
  symbol: 'circle',
  symbolSize: ['16', '10'],
  symbolOffset: ['130%', 0],
  symbolPosition: 'end',
  data: [],
  z: 4
}

const pictorialBarRight2 = {
  tooltip: {
    show: false
  },
  type: 'pictorialBar',
  itemStyle: {
    normal: {
      color: '#929832'
    }
  },
  symbol: 'circle',
  symbolSize: ['16', '10'],
  symbolOffset: ['130%', 0],
  symbolPosition: 'start',
  data: [],
  z: 3
}

export default {
  name: 'ScreenDataStatisticsChartStatisticsInfo',
  mixins: [intervalMixin],
  components: {
    JcCharts
  },
  props: {
    infoAndArea: {
      type: Object
    }
  },
  data() {
    return {
      activated: 1,
      options: null
    }
  },
  watch: {
    infoAndArea: {
      deep: true,
      handler() {
        this.processData()
      }
    }
  },
  methods: {
    changeType(val) {
      if (val) {
        if (val !== this.activated) {
          this.activated = val
          this.processData()
        } else {
          console.log('请勿重复点击')
        }
      }
    },
    processData() {
      if (this.infoAndArea) {
        options.xAxis[0].data = this.infoAndArea.areas
        if (this.activated === 1) {
          series1.name = '上报事件'
          series1.data = this.infoAndArea.events
          series1pictorialBar.data = this.infoAndArea.events
          series1pictorialBar2.data = this.infoAndArea.events
          options.series = [series1, series1pictorialBar, series1pictorialBar2]
          options.dataZoom[0].endValue = 7
          options.dataZoom[0].maxValueSpan = 11
        } else if (this.activated === 2) {
          // 进行中，已关闭，转任务
          series1.name = '进行中'
          series2.name = '已关闭'
          series3.name = '转任务'
          series1.data = this.infoAndArea.problems1
          series2.data = this.infoAndArea.problems2
          series3.data = this.infoAndArea.problems3
          pictorialBarLeft1.data = this.infoAndArea.problems1
          pictorialBarLeft2.data = this.infoAndArea.problems1
          pictorialBarMiddle1.data = this.infoAndArea.problems2
          pictorialBarMiddle2.data = this.infoAndArea.problems2
          pictorialBarRight1.data = this.infoAndArea.problems3
          pictorialBarRight2.data = this.infoAndArea.problems3
          options.series = [series1, series2, series3, pictorialBarLeft1, pictorialBarLeft2, pictorialBarMiddle1, pictorialBarMiddle2, pictorialBarRight1, pictorialBarRight2]
          options.dataZoom[0].endValue = 4
          options.dataZoom[0].maxValueSpan = 6
        } else if (this.activated === 3) {
          // 已下发，处理中，已完成
          series1.name = '已下发'
          series2.name = '处理中'
          series3.name = '已完成'
          series1.data = this.infoAndArea.tasks1
          series2.data = this.infoAndArea.tasks2
          series3.data = this.infoAndArea.tasks3
          pictorialBarLeft1.data = this.infoAndArea.tasks1
          pictorialBarLeft2.data = this.infoAndArea.tasks1
          pictorialBarMiddle1.data = this.infoAndArea.tasks2
          pictorialBarMiddle2.data = this.infoAndArea.tasks2
          pictorialBarRight1.data = this.infoAndArea.tasks3
          pictorialBarRight2.data = this.infoAndArea.tasks3
          options.series = [series1, series2, series3, pictorialBarLeft1, pictorialBarLeft2, pictorialBarMiddle1, pictorialBarMiddle2, pictorialBarRight1, pictorialBarRight2]
          options.dataZoom[0].endValue = 4
          options.dataZoom[0].maxValueSpan = 6
        }
        this.options = options
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
