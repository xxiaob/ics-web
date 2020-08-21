<template>
  <div class="jc-flex-con jc-flex-warp jc-flex-vertical info">
    <div class="jc-title">
      <span class="jc-title-content">下辖区域占比</span>
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
import intervalMixin from '../../mixins/intervalMixin'

export default {
  name: 'ScreenDataStatisticsChartStatisticsArea',
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
        let name = ''
        const data = []

        if (this.activated === 1) {
          name = '上报事件'
          this.infoAndArea.areas.forEach((area, key)=>{
            data.push({ value: this.infoAndArea.events[key], name: area })
          })
        } else if (this.activated === 2) {
          name = '网巡问题'
          this.infoAndArea.areas.forEach((area, key)=>{
            data.push({ value: this.infoAndArea.problems[key], name: area })
          })
        } else if (this.activated === 3) {
          name = '临时任务'
          this.infoAndArea.areas.forEach((area, key)=>{
            data.push({ value: this.infoAndArea.tasks[key], name: area })
          })
        }

        this.options.series[0].name = name
        this.options.series[0].data = data.sort((a, b)=> a.value - b.value)
      }
    }
  },
  created() {
    this.options = {
      color: [ '#0041fb', '#006cff', '#0096ff', '#04e0f9', '#48f754', '#f9ff5c', '#ffba00', '#ff5d5d', '#04dcfc', '#bb55eb', '#fb2087' ],
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
        bottom: 0,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 8,
        selectedMode: false,
        textStyle: {
          color: 'rgb(139,193,252)',
          padding: [2, 0, 0, 0],
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

          if (datas.length) {
            datas.forEach((v, i) => {
              total += v.value
              if (v.name == name) {
                index = i
              }
            })
            const percentage = datas[index].value === 0 ? 0 : ((datas[index].value / total) * 100).toFixed(2)
            const sName = name.length > 7 ? `${name.substring(0, 6)}...` : name

            return [`{a| ${sName}}`, `{b| ${percentage}%}`].join('')
          } else {
            return name
          }
        }
      },
      series: [
        {
          name: '下辖区域占比',
          type: 'pie',
          radius: ['40%', '75%'],
          center: ['25%', '50%'],
          label: {
            show: false
          },
          itemStyle: {
            borderWidth: 3,
            borderColor: '#000438'
          },
          data: [],
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
  }
}
</script>

<style lang="scss" scoped>
</style>
