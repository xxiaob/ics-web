<template>
  <!-- v-loading="loading" element-loading-background="rgba(32, 73, 154, 0.3)" -->
  <div class="jc-flex-con jc-flex-warp jc-flex-vertical info">
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
      activated: 1,
      loading: false,
      project: null,
      options: null,
      events: null,
      problems: null,
      tasks: null,
      colors: [
        ['#ee761e', '#ffbc07'],
        ['#112adf', '#3b7afd'],
        ['#0f89d2', '#19cfed'],
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
      this.events = eventInfoList.length ? eventInfoList.map((item, key)=>({ value: item.typeCount, name: item.typeName, itemStyle: this.itemStyle(key) })) : []

      this.problems = problemInfoList.length ? problemInfoList.map((item, key)=>({ value: item.typeCount, name: item.typeName, itemStyle: this.itemStyle(key) })) : []

      this.tasks = tempTaskInfoList.length ? tempTaskInfoList.map((item, key)=>({ value: item.sourceCount, name: item.sourceName, itemStyle: this.itemStyle(key) })) : []

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
            offset: 0, color: this.colors[key % 5][0] // 0% 处的颜色
          }, {
            offset: 1, color: this.colors[key % 5][1]// 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    },
    processData() {
      if (this.activated === 1) {
        this.options.series[0].name = '上报事件'
        this.options.series[0].data = this.events.sort((a, b)=> b.value - a.value)
      } else if (this.activated === 2) {
        this.options.series[0].name = '网巡问题'
        this.options.series[0].data = this.problems.sort((a, b)=> b.value - a.value)
      } else if (this.activated === 3) {
        this.options.series[0].name = '临时任务'
        this.options.series[0].data = this.tasks.sort((a, b)=> b.value - a.value)
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
        pageIconColor: '#112adf',
        pageIconInactiveColor: '#0f89d2',
        pageIconSize: 12,
        type: 'scroll',
        pageTextStyle: {
          color: 'rgb(139,193,252)'
        },
        orient: 'vertical',
        right: 50,
        // top: 20,
        // bottom: 20,
        // x: 'center',
        y: 'center',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 8,
        selectedMode: false,
        textStyle: {
          color: '#fcfcfd',
          padding: [2, 0, 0, 0],
          fontSize: 14,
          rich: {
            a: {
              width: 140,
              fontSize: 14,
              color: '#fcfcfd'
            },
            b: {
              width: 20,
              fontSize: 14,
              color: '#fcfcfd',
              align: 'right'
            }
          }
        },
        formatter: name=> {
          console.log('formatter', name, this.options.series[0].data)
          let index = 0, total = 0
          const datas = this.options.series[0].data

          if (datas.length) {
            datas.forEach((v, i) => {
              total += v.value
              if (v.name == name) {
                index = i
              }
            })
            const percentage = ((datas[index].value / total) * 100).toFixed(2)
            const sName = name.length > 7 ? `${name.substring(0, 6)}...` : name

            return [`{a| ${sName}}`, `{b| ${percentage}%}`].join('')
          } else {
            return name
          }
        }
      },
      series: [
        {
          name: '事务类型占比',
          type: 'pie',
          radius: '75%',
          center: ['25%', '50%'],
          label: {
            show: false
          },
          data: [],
          // roseType: 'radius',
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
