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

          <jc-charts :options="options"></jc-charts>

        </div>
      </el-card>
    </el-col>

</template>

<script>
import JcCharts from '@/components/JcForm/JcCharts' // echarts
export default {
  name: 'OrganizeBusinessService',
  components: { JcCharts },
  data() {
    return {
      activated: 1, // 业务类型占比,
      options: null,
      rankings: [] // 排名数据
    }
  },
  watch: {
    activated(newVal) {
      console.log('newVal', newVal)
      this.processData()
    }
  },
  filters: {
    formatterPercent(val) {
      return val * 100 + '%'
    }
  },
  methods: {
    processData() {
      let name = ''

      let datas = []

      let title = ''

      console.log('this.activated', this.activated)
      if (this.activated == 1) {
        console.log(111)
        title = '下辖组织 任务完成率'
        name = '任务完成率'
        datas = [
          { org: '玄武区', value: 0.6 },
          { org: '秦淮区', value: 0.7 },
          { org: '建邺区', value: 0.64 },
          { org: '鼓楼区', value: 0.8 },
          { org: '鼓楼区', value: 0.86 },
          { org: '玄武区', value: 0.6 },
          { org: '秦淮区', value: 0.7 },
          { org: '建邺区', value: 0.64 },
          { org: '鼓楼区', value: 0.8 },
          { org: '鼓楼区', value: 0.86 }
        ]
      } else if (this.activated == 2) {
        console.log(222)

        title = '下辖组织 问题完成率'
        name = '问题完成率'
        datas = [
          { org: '玄武区', value: 0.6 },
          { org: '秦淮区', value: 0.7 },
          { org: '建邺区', value: 0.64 },
          { org: '鼓楼区', value: 0.8 },
          { org: '鼓楼区', value: 0.86 }
        ]
      }

      console.log('datas', datas)


      let xAxisDatas = datas.map(item => item.org)

      let yAxisDatas = datas.map(item => item.value)

      this.options.series[0].name = name
      this.options.xAxis[0].data = xAxisDatas // x轴数据
      this.options.series[0].data = yAxisDatas
      this.options.title.text = `${ title}` // 标题


      // 处理排名数据
      this.rankings = datas.sort((a, b) => b.value - a.value).filter((v, i) => i < 6)
    }
  },
  created() {
    this.options = {
      color: ['#6AA3FF'],
      title: {
        text: '',
        textStyle: {
          color: '#333',
          fontSize: 14,
          fontWeight: '600'
        },
        padding: [16, 0, 0, 0] // 位置
      },
      tooltip: {
        trigger: 'item',
        formatter: params => `${params.seriesName} <br/>${params.name} : ${params.value * 100}%`

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
            color: '#6E7D9C',
            formatter: value => `${value * 100} %`
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#EBEEF5',
              width: 1,
              type: 'dashed'
            }
          },
          min: 0,
          max: 1,
          gridIndex: 0
        }
      ],
      series: [
        {
          name: '业务完成率',
          type: 'bar',
          legendHoverLink: true,
          barWidth: 20,
          itemStyle: {
            barBorderRadius: [100, 100, 0, 0]

          },
          data: [],

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: ()=> {
            return Math.random() * 200
          }
        }
      ]

    }

    this.processData()
  }
}
</script>

<style lang="scss" scoped>
.jc-business-complete{
  padding-left:40px;
}

</style>
