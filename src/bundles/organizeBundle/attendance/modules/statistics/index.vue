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
export default {
  name: 'OrganizeAttendanceStatistics',
  components: { JcCharts },
  data() {
    return {
      activated: 1, // 业务类型占比,
      options: null
    }
  },
  watch: {
    activated(newVal) {
      console.log('newVal', newVal)
      this.processData()
    }
  },
  methods: {
    processData() {
      let name = ''

      let datas = []

      console.log('this.activated', this.activated)
      if (this.activated == 1) {
        console.log(111)
        name = '里程统计'
        datas = [
          {
            name: '巡逻',
            data: [
              {
                name: '周一',
                value: 200
              },
              {
                name: '周二',
                value: 330
              },
              {
                name: '周三',
                value: 120
              },
              {
                name: '周四',
                value: 305
              },
              {
                name: '周五',
                value: 480
              },
              {
                name: '周六',
                value: 156
              },
              {
                name: '周日',
                value: 210
              }
            ]
          },
          {
            name: '在岗',
            data: [
              {
                name: '周一',
                value: 260
              },
              {
                name: '周二',
                value: 480
              },
              {
                name: '周三',
                value: 346
              },
              {
                name: '周四',
                value: 315
              },
              {
                name: '周五',
                value: 120
              },
              {
                name: '周六',
                value: 165
              },
              {
                name: '周日',
                value: 277
              }
            ]
          },
          {
            name: '出圈',
            data: [
              {
                name: '周一',
                value: 330
              },
              {
                name: '周二',
                value: 380
              },
              {
                name: '周三',
                value: 268
              },
              {
                name: '周四',
                value: 286
              },
              {
                name: '周五',
                value: 178
              },
              {
                name: '周六',
                value: 168
              },
              {
                name: '周日',
                value: 155
              }
            ]
          }

        ]
      } else if (this.activated == 2) {
        console.log(222)

        name = '时长统计'
        datas = [
          {
            name: '巡逻',
            data: [
              {
                name: '周一',
                value: 16
              },
              {
                name: '周二',
                value: 18
              },
              {
                name: '周三',
                value: 19
              },
              {
                name: '周四',
                value: 23
              },
              {
                name: '周五',
                value: 38
              },
              {
                name: '周六',
                value: 41
              },
              {
                name: '周日',
                value: 27
              }
            ]
          },
          {
            name: '在岗',
            data: [
              {
                name: '周一',
                value: 45
              },
              {
                name: '周二',
                value: 31
              },
              {
                name: '周三',
                value: 29
              },
              {
                name: '周四',
                value: 22
              },
              {
                name: '周五',
                value: 27
              },
              {
                name: '周六',
                value: 29
              },
              {
                name: '周日',
                value: 24
              }
            ]
          },
          {
            name: '出圈',
            data: [
              {
                name: '周一',
                value: 19
              },
              {
                name: '周二',
                value: 24
              },
              {
                name: '周三',
                value: 16
              },
              {
                name: '周四',
                value: 8
              },
              {
                name: '周五',
                value: 9
              },
              {
                name: '周六',
                value: 17
              },
              {
                name: '周日',
                value: 28
              }
            ]
          }

        ]
      }

      console.log('datas', datas)

      this.options.xAxis.data = datas[0].data.map(item => item.name)

      this.options.series = []
      datas.forEach( data => {
        this.options.series.push({
          name: data.name,
          type: 'line',
          symbol: 'circle',
          data: data.data.map(item => item.value)
        })
      })
      this.options.title.text = name
    }
  },
  created() {
    this.options = {
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
          // console.log('this', this.options.title.text)
          let table = params[0].name

          let company = this.options.title.text == '里程统计' ? 'km' : 'h'

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
      series: []

    }

    this.processData()
  }
}
</script>

<style lang="scss" scoped>
.jc-attendance-statistic{
  padding-right:40px;
}
</style>
