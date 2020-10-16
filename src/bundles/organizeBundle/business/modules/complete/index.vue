<template>
    <el-col :span="16" class="jc-business-complete">
      <el-card >
      <div slot="header" class="jc-card-header">
          <div class="jc-card-title">业务完成率</div>
          <!-- <el-radio-group class="jc-button-group" v-model="activated" size="mini">
            <el-radio-button  label="1">任务</el-radio-button>
            <el-radio-button  label="2">问题</el-radio-button>
          </el-radio-group> -->
        </div>

        <div class="jc-type-echarts jc-flex-warp">
          <div class="jc-flex-con">
            <jc-charts :options="options" :isClear="true"></jc-charts>
          </div>
          <div class="jc-complete-ranking">
            <div class="jc-complete-title">下辖组织排名<span>Top6</span></div>
            <ul class="jc-ranking-wrap">
              <li class="jc-flex-warp jc-ranking-item" v-for="(ranking,index) in rankings" :key="index">
                <div class="jc-flex-warp">

                  <span v-if="index === 0 || index === 1 || index === 2" class="jc-ranking-icon" :class="{'jc-first-place': index === 0, 'jc-second-place': index === 1, 'jc-third-place': index === 2 }"></span>
                  <span class="jc-ranking-icon jc-other-ranking" v-else>{{ index + 1 }}</span>
                  <span>{{ ranking.orgName }}</span>
                </div>
                <span>{{ ranking.taskRate }}</span>
              </li>
            </ul>
          </div>
        </div>

      </el-card>
    </el-col>

</template>

<script>
import JcCharts from '@/components/JcForm/JcCharts' // echarts

let options = {
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
    left: '8%',
    right: '6%',
    bottom: '24%',
    top: '20%',
    containLabel: false
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
        margin: 20, // 刻度标签与轴线之间的距离
        fontSize: 12,
        color: '#666', // 默认取轴线的颜色
        rotate: -20
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
        barBorderRadius: [10, 10, 0, 0]

      },
      data: [],

      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: ()=> {
        return Math.random() * 200
      }
    }
  ],
  dataZoom: [
    {
      show: true,
      height: 8,
      xAxisIndex: [
        0
      ],
      bottom: '20%',
      startValue: 0,
      endValue: 7,
      showDetail: false

    },
    {
      type: 'inside',
      startValue: 0,
      maxValueSpan: 11,
      endValue: 7
    }
  ]

}

export default {
  name: 'OrganizeBusinessComplete',
  components: { JcCharts },
  props: {
    taskRate: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // activated: 1, //  未来可能需要
      options: null,
      rankings: [] // 排名数据
    }
  },
  watch: {
    taskRate() {
      this.processData()
    }
  },
  methods: {
    processData() {
      // 处理echarts数据和 排名
      if (this.taskRate && this.taskRate.length) {
        let data = [...this.taskRate].splice(1)

        // echarts
        let xAxisDatas = data.map(item => item.orgName)

        let yAxisDatas = data.map(item => item.taskCompletedRate)

        options.series[0].name = '任务完成率'
        options.title.text = '下辖组织 任务完成率' // 标题
        options.xAxis[0].data = xAxisDatas // x轴数据
        options.series[0].data = yAxisDatas // y轴数据

        this.options = options

        // 处理数据排名
        let rankings = [...data].sort((a, b) => b.taskCompletedRate - a.taskCompletedRate).filter((v, i) => i < 6)

        rankings.forEach(item => {
          item.taskRate = item.taskCompletedRate * 100 + '%'
        })
        this.rankings = rankings
      }
    }
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
