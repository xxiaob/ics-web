<template>
    <el-col :span="12" class="jc-business-complete">
      <el-card >
      <div slot="header" class="jc-card-header">
          <div class="jc-card-title">岗点勤务</div>
          <el-radio-group class="jc-button-group" v-model="activated" size="mini">
            <el-radio-button  label="1">岗点任务</el-radio-button>
            <el-radio-button  label="2">达标比率</el-radio-button>
          </el-radio-group>
        </div>

        <div class="jc-type-echarts">

          <jc-charts :options="options" isClear="true"></jc-charts>

        </div>
      </el-card>
    </el-col>

</template>

<script>
import JcCharts from '@/components/JcForm/JcCharts' // echarts

let options = {
  color: ['#6AA3FF', '#FF7CA2'],
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
    padding: [18, 0, 0, 80],
    icon: 'circle',
    itemWidth: 10,
    data: ['日常', '达标']
  },
  tooltip: {
    show: true
  },
  grid: {
    left: 0,
    right: '6%',
    bottom: '10%',
    top: '20%',
    containLabel: true
  },
  xAxis: [
    {
      position: 'bottom',
      type: 'category',

      axisLine: { // 坐标轴 轴线
        show: false // 是否显示
      },
      axisTick: { // 坐标轴 刻度
        show: false // 是否显示
      },
      axisLabel: { // 坐标轴标签
        show: true, // 是否显示
        margin: 12, // 刻度标签与轴线之间的距离
        rotate: -20,
        fontSize: 12,
        color: '#666' // 默认取轴线的颜色
      },

      splitLine: {
        show: false
      },

      gridIndex: 0,
      data: []
    }
  ],
  yAxis: [
    {
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
        color: '#6E7D9C'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#EBEEF5',
          width: 1,
          type: 'dashed'
        }
      },
      gridIndex: 0
    }
  ],
  series: [],
  dataZoom: [
    {
      type: 'inside',
      startValue: 0,
      maxValueSpan: 11,
      endValue: 7
    }
  ]

}

let serie1 = {
  name: '岗点任务',
  type: 'bar',
  legendHoverLink: true,
  barWidth: 14,
  itemStyle: {

  },
  data: [],
  barGap: 0,
  animationType: 'scale',
  animationEasing: 'elasticOut',
  animationDelay: ()=> {
    return Math.random() * 200
  }
}

let serie2 = {
  name: '达标任务',
  type: 'bar',
  legendHoverLink: true,
  barWidth: 14,
  itemStyle: {

  },
  data: [],
  animationType: 'scale',
  animationEasing: 'elasticOut',
  animationDelay: ()=> {
    return Math.random() * 200
  }
}

export default {
  name: 'OrganizeBusinessService',
  components: { JcCharts },
  data() {
    return {
      activated: 1,
      options: null
    }
  },
  props: {
    list: {
      type: Array
    }
  },
  watch: {
    activated() {
      this.processData()
    },
    list() {
      this.processData()
    }
  },
  methods: {
    processData() {
      if (!this.list) {
        return
      }
      let list = this.list

      let xAxisDatas = list.map(item => item.orgName) // 获取x轴坐标


      if (this.activated == 1) {
        options.title.text = '岗点任务'
        serie1.name = '日常'
        serie2.name = '达标'

        let yData1 = list.map(item => item.postTaskCount)

        let yData2 = list.map(item => item.postReachTaskCount)

        options.xAxis[0].data = xAxisDatas
        serie1.data = yData1
        serie2.data = yData2
        options.yAxis[0].axisLabel.formatter = value => `${value}`

        options.series = [serie1, serie2]
      } else if (this.activated == 2) {
        options.title.text = '达标比率'
        serie1.name = '达标比率'

        let yData = list.map(item => item.postReachRate)

        options.xAxis[0].data = xAxisDatas
        options.yAxis[0].axisLabel.formatter = value => `${value * 100} %`


        serie1.data = yData
        options.series = [serie1]
      }

      this.options = options
    }
  }

}
</script>

<style lang="scss" scoped>
.jc-business-complete{
  padding-left:40px;
}

</style>
