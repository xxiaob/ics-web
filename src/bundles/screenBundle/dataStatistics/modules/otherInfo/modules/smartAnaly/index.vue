<template>
  <div class="smart-analy jc-flex-warp">
    <jc-abstract-area title="AI 智能分析">
      <div class="smart-analy-content jc-flex-warp jc-flex-con">

        <div class="smart-analy-left jc-flex-con-2 jc-flex-warp jc-flex-vertical">

          <div class="smart-analy-item jc-flex-con jc-flex-warp" v-for="(item,index) in eventGroupLeftData" :key="index" @click="currentEventGroup(item,index)">
            <span class="smart-analy-title">{{ item.typeName && item.typeName}}</span>
            <span>
              <count-to :startVal="0" :endVal="item.typeCount || 0" /> 件
            </span>
          </div>

        </div>

        <div class="smart-analy-center jc-flex-con-3">
          <jc-charts :options="options"></jc-charts>
          <div class="smart-analy-count jc-flex-warp">
            <div class="count-to-wrap">
              <count-to :startVal="0" :endVal="total || 0" /> 件
            </div>
          </div>
        </div>

        <div class="smart-analy-right jc-flex-con-2 jc-flex-warp jc-flex-vertical">
          <div class="smart-analy-item jc-flex-con jc-flex-warp" v-for="(item,index) in eventGroupRightData" :key="index" @click="currentEventGroup(item,index+4)">
            <span class="smart-analy-title">{{ item.typeName && item.typeName}}</span>
            <span>
              <count-to :startVal="0" :endVal="item.typeCount || 0" /> 件
            </span>
          </div>
        </div>
      </div>
    </jc-abstract-area>
  </div>
</template>

<script>
import JcAbstractArea from '../../../common/abstractArea'
import JcCharts from '@/components/JcForm/JcCharts' // echarts
import countTo from 'vue-count-to'
import { getEventGroupByEventType } from '@/api/dataScreen' // 获取数据方法
import moment from 'moment'

export default {
  name: 'ScreenDataStatisticsOtherInfoSmartAnaly',
  components: { JcAbstractArea, countTo, JcCharts },
  data() {
    return {
      current: 0, // 当前事件数
      total: 0, // 总事件数
      today: new Date(moment().format('YYYY-MM-DD') + ' 00:00:00').getTime(),
      project: {},
      options: {},
      eventGroupData: [],
      eventGroupLeftData: [],
      eventGroupRightData: [],
      timerId: 0
    }
  },
  created() {
    // 获取projectId所在对象
    this.$EventBus.$on('data-statistics-init-success', val=>{
      console.log('chartStatistics 接收信息成功', val)
      this.project = val
      this.getEventGroupByEventTypeData() // AI分析
    })
  },
  methods: {
    async getEventGroupByEventTypeData() {
      let beginTime = new Date(this.today) // 开始时间

      let endTime = new Date(this.today + 24 * 60 * 60 * 1000) // 结束时间


      let { projectId } = this.project // projectId

      // 发送请求获取数据
      let eventGroupData = await getEventGroupByEventType({ projectId })

      console.log(eventGroupData)
      // 处理数据
      // 事件总数
      let total = this.total = eventGroupData.total

      // 过滤数据
      eventGroupData.eventInfoList = eventGroupData.eventInfoList && eventGroupData.eventInfoList.reduce((prev, current, index) => {
        if (index < 7 ) {
          total = total - current.typeCount
          prev.push(current)
        } else if (index == 7) {
          prev.push({
            typeName: '其他',
            typeCount: total
          })
        }

        return prev
      }, [])


      // 将处理后的数据存到data中
      this.eventGroupData = eventGroupData
      this.eventGroupLeftData = eventGroupData.eventInfoList && eventGroupData.eventInfoList.filter((item, index) => index < 4)
      this.eventGroupRightData = eventGroupData.eventInfoList && eventGroupData.eventInfoList.filter((item, index) => index > 3)


      this.smartAnalySetInterval() // 定时器函数
    },

    // 定时器函数
    smartAnalySetInterval() {
      let { timerId } = this

      this.current = this.eventGroupData.eventInfoList[timerId] && this.eventGroupData.eventInfoList[timerId].typeCount
      timerId++
      this.initEchart()


      // 开启定时器
      this.smartTimerID = setInterval(() => {
        this.current = this.eventGroupData.eventInfoList[timerId] && this.eventGroupData.eventInfoList[timerId].typeCount
        timerId++
        this.timerId = timerId = timerId > 7 ? 0 : timerId // 判断边界

        this.initEchart() // 开始echarts动画
      }, 3000)
    },

    // 点击事件函数
    currentEventGroup(current, index) {
      // 清除定时器
      clearInterval(this.smartTimerID)
      clearTimeout(this.timeroutId)

      // 赋予当前点击时的数据与索引
      this.current = current.typeCount
      this.timerId = index
      this.initEchart()

      // 延迟开启定时器
      this.timeroutId = setTimeout(() => {
        this.timerId = ++index
        this.smartAnalySetInterval()
      }, 3000)
    },

    // echarts 动画函数
    initEchart() {
      let eventPrecent = this.current / this.total

      let precent = eventPrecent * 268 // 计算比例

      let color = 'rgba(21,229,253,1)'

      if ((eventPrecent * 100) < 30) {
        color = 'rgba(21,229,253,0.4)'
      } else if ((eventPrecent * 100) < 60) {
        color = 'rgba(21,229,253,0.6)'
      } else if ((eventPrecent * 100) < 80) {
        color = 'rgba(21,229,253,0.8)'
      }

      const { PI, cos, sin } = Math

      // 数据源
      const val1 = (precent / 360) * 100


      // 圆心角的一半
      const angle1 = PI * val1 / 50 / 2

      // 渐变起点
      const pointStart = [
        0.5 - 0.5 * cos(angle1) * sin(angle1),
        0.5 + 0.5 * cos(angle1) * cos(angle1)
      ]
      // 渐变终点
      const pointEnd1 = [
        0.5 - 0.5 * sin(angle1),
        0.5 + 0.5 * cos(angle1)
      ]

      this.options = {
        backgroundColor: 'transparent',
        title: {
          'x': '50%',
          'y': '50%',
          top: '30%', //字体的位置
          left: '33%',
          'text': '事件总数',
          'textStyle': {
            'fontWeight': 'normal',
            'color': '#11e7ff',
            'fontSize': 14
          }


        },

        series: [{
          'name': '',
          'type': 'pie',
          'radius': ['66%', '88%'],
          'center': ['49.5%', '51%'],
          'startAngle': 224,
          'hoverAnimation': false, //是否开启 hover 在扇区上的放大动画效果。
          'legendHoverLink': false, //是否启用图例 hover 时的联动高亮。
          'label': {
            'normal': {
              'show': false,
              'position': 'center'
            }

          },
          'labelLine': {
            'normal': {
              'show': false
            }
          },
          data: [{
            name: '',
            value: val1,
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: pointStart[0],
                  y: pointStart[1], //  注意此处注释掉了，若没有注释将是另一种效果
                  x2: pointEnd1[0],
                  y2: pointEnd1[1],
                  colorStops: [
                  // !! 在此添加想要的渐变过程色 !!
                    { offset: 0, color: color }, //rgba(21,229,253,1)
                    { offset: 1, color: 'rgba(21,229,253,0.2)' }//rgba(0,0,0,0)
                  ]
                },
                shadowColor: 'rgba(21,229,253,0.8)',
                shadowBlur: 10
              }
            }
          }, {
            name: '',
            value: 100 - val1,
            label: {
              normal: {
                show: false,
                fontSize: 0
              }
            },
            itemStyle: {
              normal: {
                color: 'transparent'
              },
              emphasis: {
                color: 'transparent'
              }
            },
            hoverAnimation: false
          }]
        }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.smart-analy {
  font-size: 12px;
  .smart-analy-content {
    padding: 16px;

    .smart-analy-center {
      position: relative;
      margin: 0 14px;
      background: url("./assets/smartanaly-centerbg.png") no-repeat
        center/contain;

      .smart-analy-count {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        justify-content: center;
        align-items: center;
        color: #11e7ff;

        .count-to-wrap {
          margin-top: 20px;
          span {
            font-size: 34px;
          }
        }
      }
    }

    .smart-analy-item {
      justify-content: center;
      align-items: center;
      color: #11e7ff;
      background: url("./assets/smartanaly-bg.png") no-repeat 0 0 / 100% 100%;

      &:nth-child(n + 2) {
        margin-top: 16px;
      }

      & .smart-analy-title {
        margin-right: 10px;
      }
    }
  }
}
</style>
