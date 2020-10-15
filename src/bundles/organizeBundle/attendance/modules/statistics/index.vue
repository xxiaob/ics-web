<template>
    <el-col :span="12" class="jc-attendance-statistic">
      <el-card >
      <div slot="header" class="jc-card-header">
          <div class="jc-card-title">出勤统计</div>
          <el-radio-group class="jc-button-group" v-model="activated" size="mini">
            <el-radio-button  label="1">里程</el-radio-button>
            <el-radio-button  label="2">时长</el-radio-button>
          </el-radio-group>
        </div>

        <div class="jc-type-echarts jc-flex-con">
          <jc-charts :options="options" isClear="true"></jc-charts>
        </div>

      </el-card>
    </el-col>
</template>

<script>

import JcCharts from '@/components/JcForm/JcCharts' // echarts

let options = {
  color: ['#6175FA', '#8DB754', '#FA6196'],
  title: {
    text: '',
    textStyle: {
      color: '#333',
      fontSize: 14,
      fontWeight: '600'
    },
    padding: [16, 0, 0, 0] // 位置
  },
  legend: {
    x: 'left',
    padding: [16, 0, 0, 80],
    data: ['巡逻', '在岗', '出圈']

  },
  grid: {
    left: 0,
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'line' },
    formatter: (params) => {
      let table = params[0].name

      let company = options.title.text == '里程统计' ? 'km' : 'h'

      table += '<br />'
      params.forEach(param => {
        table += param.marker + param.seriesName + ': ' + param.value + company + '<br />'
      })
      return table
    }
  },
  xAxis: {
    type: 'category',
    position: 'bottom',
    boundaryGap: false,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: true,
      margin: 16,
      fontSize: 12,
      color: '#666'
    },
    data: []
  },
  yAxis: {
    type: 'value',
    position: 'left',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: true,
      fontSize: 12,
      color: '#999'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#ccc',
        width: 1,
        type: 'dashed'
      }
    }
  },
  series: [],
  dataZoom: [

  ]

}

let series1 = {
  name: '巡逻',
  type: 'line',
  symbol: 'circle',
  data: []
}

let series2 = {
  name: '在岗',
  type: 'line',
  symbol: 'circle',
  data: []
}

let series3 = {
  name: '出圈',
  type: 'line',
  symbol: 'circle',
  data: []
}

export default {
  name: 'OrganizeAttendanceStatistics',
  components: { JcCharts },
  data() {
    return {
      activated: 1, // 业务类型占比,
      options: null
    }
  },
  props: {
    statistics: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    activated(newVal) {
      console.log('newVal', newVal)
      this.processData()
    },
    statistics(val) {
      console.log('val', val)
      this.processData()
    }
  },
  methods: {
    processData() {
      console.log('statistics', this.statistics)
      if (!this.statistics) {
        return
      }
      console.log('statistics', this.statistics)
      let statistics = this.statistics


      options.xAxis.data = statistics.map(item => item.time)

      console.log('this.activated', this.activated)
      if (this.activated == 1) {
        options.title.text = '里程统计'
        series1.data = statistics.map(item => item.inCircleJourney)
        series2.data = statistics.map(item => item.journey)
        series3.data = statistics.map(item => item.outCircleJourney)
      } else if (this.activated == 2) {
        options.title.text = '时长统计'
        series1.data = statistics.map(item => item.inCircleDuration)
        series2.data = statistics.map(item => item.onguardDuration)
        series3.data = statistics.map(item => item.outCircleDuration)
      }


      options.series = [series1, series2, series3]
      this.options = options
    }
  },
  created() {
    this.processData()
  }
}
</script>

<style lang="scss" scoped>
.jc-attendance-statistic{
  padding-right:40px;
}
</style>
