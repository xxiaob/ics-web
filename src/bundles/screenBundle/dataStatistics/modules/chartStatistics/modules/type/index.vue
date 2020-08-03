<template>
  <!-- v-loading="loading" element-loading-background="rgba(32, 73, 154, 0.3)" -->
  <div class="jc-flex-con jc-flex-warp jc-flex-vertical info" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div class="jc-title">
      <span class="jc-title-content">事务类型占比</span>
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
import JcCharts from '@/components/JcForm/JcCharts'
import { getTransactionType } from '@/api/dataScreen'
import intervalMixin from '../../mixins/intervalMixin'

export default {
  name: 'ScreenDataStatisticsChartStatisticsType',
  mixins: [intervalMixin],
  components: {
    JcCharts
  },
  props: {
    date: {
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      project: null,
      options: null,
      events: null,
      problems: null,
      tasks: null,
      colors: [
        ['#112adf', '#3b7afd'],
        ['#0f89d2', '#19cfed'],
        ['#ee761e', '#ffbc07'],
        ['#5f1eee', '#9e4bfb'],
        ['#d21fff', '#ff4b9b']
      ]
    }
  },
  watch: {
    date: {
      deep: true,
      handler() {
        this.initData()
      }
    }
  },
  methods: {
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const res = await getTransactionType({ ...this.date, projectId: this.project.projectId })

          this.handelData(res)
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },
    handelData({ eventInfoList, problemInfoList, tempTaskInfoList }) {
      this.events = eventInfoList.length ? eventInfoList.map((item, key)=>({ value: item.typeCount, name: item.typeName, itemStyle: this.itemStyle(key) })) : [{}]

      this.problems = problemInfoList.length ? problemInfoList.map((item, key)=>({ value: item.typeCount, name: item.typeName, itemStyle: this.itemStyle(key) })) : [{}]

      this.tasks = tempTaskInfoList.length ? tempTaskInfoList.map((item, key)=>({ value: item.sourceCount, name: item.sourceName, itemStyle: this.itemStyle(key) })) : [{}]

      this.processData()
    },
    itemStyle(key) {
      return {
        color: {
          type: 'linear',
          x: 0,
          y: 1,
          x2: 0,
          y2: 0,
          colorStops: [{
            offset: 0, color: this.colors[key] ? this.colors[key][0] : this.colors[0][0] // 0% 处的颜色
          }, {
            offset: 1, color: this.colors[key] ? this.colors[key][1] : this.colors[0][1]// 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    },
    processData() {
      if (this.activated === 1) {
        this.options.series[0].name = '上报事件'
        this.options.series[0].data = this.events.sort((a, b)=> a.value - b.value)
      } else if (this.activated === 2) {
        this.options.series[0].name = '网巡问题'
        this.options.series[0].data = this.problems.sort((a, b)=> a.value - b.value)
      } else if (this.activated === 3) {
        this.options.series[0].name = '临时任务'
        this.options.series[0].data = this.tasks.sort((a, b)=> a.value - b.value)
      }
    }
  },
  created() {
    this.options = {
      color: [ '#112adf', '#0f89d2', '#ee761e', '#5f1eee', '#d21fff', '#ff7140', '#fd5503', '#e22d14', '#04dcfc', '#bb55eb', '#fb2087' ],
      textStyle: {
        color: 'white',
        fontSize: 12
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 50,
        top: 20,
        bottom: 20,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 20,
        textStyle: {
          color: 'rgb(139,193,252)',
          fontSize: 12,
          rich: {
            a: {
              width: 120,
              color: 'rgb(139,193,252)'
            },
            b: {
              width: 20,
              color: 'rgb(139,193,252)',
              align: 'right'
            }
          }
        },
        formatter: name=> {
          let index = 0, total = 0
          const datas = this.options.series[0].data

          datas.forEach((v, i) => {
            total += v.value
            if (v.name == name) {
              index = i
            }
          })
          const percentage = ((datas[index].value / total) * 100).toFixed(2)
          const sName = name.length > 7 ? `${name.substring(0, 6)}...` : name

          return [`{a| ${sName}}`, `{b| ${percentage}%}`].join('')
        }
      },
      series: [
        {
          name: '事务类型占比',
          type: 'pie',
          center: ['25%', '50%'],
          label: {
            show: false
          },
          data: [{}],
          roseType: 'radius',
          // labelLine: {
          //  lineStyle: {
          //   color: 'white'
          //  },
          //  smooth: 0.2,
          //  length: 10,
          //  length2: 20
          // },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: ()=> {
            return Math.random() * 200
          }
        }
      ]
    }

    this.$EventBus.$on('data-statistics-init-success', val=>{
      console.log('type 接收信息成功', val)
      this.project = val
      this.initData()
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
