<template>
  <div class="jc-flex-con jc-flex-warp jc-flex-vertical info">
    <div class="jc-title">
      <!-- <img class="jc-title-sign" src="@/bundles/screenBundle/dataStatistics/assets/title.png" alt="" height="18"> -->
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
export default {
  name: 'ScreenDataStatisticsChartStatisticsType',
  components: {
    JcCharts
  },
  props: {
    cycle: {
      type: Number
    }
  },
  data() {
    return {
      project: null,
      options: null,
      activated: 1
    }
  },
  watch: {
    cycle() {
      console.log('Type 周期变化', this.cycle)
    }
  },
  methods: {
    changeType(val) {
      if (val !== this.activated) {
        this.activated = val
      } else {
        console.log('请勿重复点击')
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
          data: [
            {
              value: 335,
              name: '私搭乱建私搭乱',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 1,
                  x2: 0,
                  y2: 0,
                  colorStops: [{
                    offset: 0, color: '#112adf' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#3b7afd' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            },
            {
              value: 310,
              name: '非法小广告',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 1,
                  x2: 0,
                  y2: 0,
                  colorStops: [{
                    offset: 0, color: '#0f89d2' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#19cfed' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            },
            {
              value: 274,
              name: '绿地脏乱',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 1,
                  x2: 0,
                  y2: 0,
                  colorStops: [{
                    offset: 0, color: '#ee761e' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#ffbc07' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            },
            {
              value: 235,
              name: '倚门出摊',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 1,
                  x2: 0,
                  y2: 0,
                  colorStops: [{
                    offset: 0, color: '#5f1eee' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#9e4bfb' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            },
            {
              value: 200,
              name: '机动车乱停放',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 1,
                  x2: 0,
                  y2: 0,
                  colorStops: [{
                    offset: 0, color: '#d21fff' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#ff4b9b' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            }
          ].sort( (a, b)=> a.value - b.value),
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
      console.log('info 接收信息成功', val)
      this.project = val
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
