<template>
    <el-col :span="16" class="jc-business-complete">
      <el-card >
      <div slot="header" class="jc-card-header">
          <div class="jc-card-title">业务完成率</div>
          <el-radio-group class="jc-button-group" v-model="activated" size="mini">
            <el-radio-button  label="1">任务</el-radio-button>
            <el-radio-button  label="2">问题</el-radio-button>
          </el-radio-group>
        </div>

        <div class="jc-type-echarts jc-flex-warp">
          <div class="jc-flex-con">
            <jc-charts :options="options"></jc-charts>
          </div>
          <div class="jc-complete-ranking">
            <div class="jc-complete-title">下辖组织排名<span>Top6</span></div>
            <ul class="jc-ranking-wrap">
              <li class="jc-flex-warp jc-ranking-item" v-for="(ranking,index) in rankings" :key="index">
                <div class="jc-flex-warp">

                  <span v-if="index === 0 || index === 1 || index === 2" class="jc-ranking-icon" :class="{'jc-first-place': index === 0, 'jc-second-place': index === 1, 'jc-third-place': index === 2 }"></span>
                  <span class="jc-ranking-icon jc-other-ranking" v-else>{{ index + 1 }}</span>
                  <span>{{ ranking.org }}</span>
                </div>
                <span>{{ ranking.value | formatterPercent }}</span>
              </li>
            </ul>
          </div>
        </div>

      </el-card>
    </el-col>

</template>

<script>
import JcCharts from '@/components/JcForm/JcCharts' // echarts
export default {
  name: 'OrganizeBusinessComplete',
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
  padding-left:80px;
}
.jc-complete-ranking{
  width:220px;
  background:#FAFAFA;
  padding:20px 30px;

  .jc-complete-title{
    font-size: 14px;
    color: #333;
    text-align: center;
    font-weight: 600;
    padding-bottom: 10px;

    span{
      margin-left:20px;
    }
  }

  .jc-ranking-item{
    justify-content: space-between;
    margin-top:16px;
    font-size:12px;

    .jc-ranking-icon{
      width: 16px;
      height: 16px;
      margin-right:10px;
      text-align: center;

      &.jc-first-place{
        background-image: url('./assets/first.png');
        background-size: cover;
      }
      &.jc-second-place{
        background-image: url('./assets/second.png');
        background-size: cover;
      }
      &.jc-third-place{
        background-image: url('./assets/third.png');
        background-size: cover;
      }

      &.jc-other-ranking{
        background-color:#E3E7F2;
        border-radius: 50%;
        color: #949EB4;
      }
    }
  }

}

</style>
