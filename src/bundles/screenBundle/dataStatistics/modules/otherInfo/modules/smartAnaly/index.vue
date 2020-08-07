<template>
  <div class="smart-analy jc-flex-warp">
    <jc-abstract-area title="AI 智能分析">
      <div class="smart-analy-content jc-flex-warp jc-flex-con">

        <div class="smart-analy-left jc-flex-con-2 jc-flex-warp jc-flex-vertical">

          <div class="smart-analy-item jc-flex-con jc-flex-warp" :class="{actived:item.isActived}" v-for="(item,index) in eventGroupLeftData" :key="index" @click="currentEventGroup(item,index)">
            <span class="smart-analy-title jc-flex-con">{{ item.typeName && item.typeName}}</span>
            <span class="smart-analy-count">
              <count-to :startVal="0" :endVal="item.typeCount || 0" />件
            </span>
          </div>

        </div>

        <div class="smart-analy-center jc-flex-con-3">
          <jc-charts :options="options"></jc-charts>
          <div class="smart-analy-count jc-flex-warp jc-flex-vertical">
            <div class="smart-analy-title">事件总数</div>
            <div class="count-to-wrap">
              <count-to :startVal="0" :endVal="total || 0" /> 件
            </div>
          </div>
        </div>

        <div class="smart-analy-right jc-flex-con-2 jc-flex-warp jc-flex-vertical">
          <div class="smart-analy-item jc-flex-con jc-flex-warp" :class="{actived:item.isActived}" v-for="(item,index) in eventGroupRightData" :key="index" @click="currentEventGroup(item,index+4)">
            <span class="smart-analy-title jc-flex-con">{{ item.typeName && item.typeName}}</span>
            <span class="smart-analy-count">
              <count-to :startVal="0" :endVal="item.typeCount || 0" />件
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
      today: new Date(moment().format('YYYY-MM-DD') + ' 00:00:00').getTime(), // 初始时间
      project: {}, // 获取projectId的对象
      options: {}, // echarts配置对象
      eventGroupData: {}, // AI智能分析处理后的数据
      eventGroupLeftData: [], // AI智能分析左侧4条数据
      eventGroupRightData: [], // AI智能分析右侧4条数据
      timerId: 0 // 迭代索引
    }
  },
  created() {
    // 获取projectId所在对象
    this.$EventBus.$on('data-statistics-init-success', val=>{
      this.project = val

      // 轮询更新数据

      this.getEventGroupByEventTypeData() // AI分析

      this.smartDataId = setInterval(() => {
        this.getEventGroupByEventTypeData()
      }, 40000)
    })
  },
  methods: {
    async getEventGroupByEventTypeData() {
      let beginTime = new Date(this.today) // 开始时间

      let endTime = new Date(this.today + 24 * 60 * 60 * 1000) // 结束时间


      let { projectId } = this.project // projectId

      // 发送请求获取数据
      let eventGroupData = await getEventGroupByEventType({ beginTime, endTime, projectId })

      console.log(eventGroupData)
      // 处理数据
      // 事件总数
      let total = this.total = eventGroupData.total

      // 过滤数据
      eventGroupData.eventInfoList = eventGroupData.eventInfoList && eventGroupData.eventInfoList.reduce((prev, current, index) => {
        if (index < 7 ) {
          total = total - current.typeCount
          prev.push({
            ...current,
            isActived: false
          })
        } else if (index == 7) {
          prev.push({
            typeName: '其他',
            typeCount: total,
            isActived: false
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
      clearInterval(this.smartTimerID)
      let { timerId } = this

      // 执行echarts动画函数
      let performEcharts = () => {
        this.timerId = timerId // 同步timerID

        // 确定当前值
        this.current = this.eventGroupData.eventInfoList[timerId] && this.eventGroupData.eventInfoList[timerId].typeCount
        this.initEchart()


        // 处理active
        let oldIndex = timerId - 1

        oldIndex = oldIndex < 0 ? 7 : oldIndex
        this.switchActived(oldIndex, timerId)

        // 累加
        timerId++
        timerId = timerId % 8// 判断边界
      }

      // 初始echarts动画一次
      performEcharts()


      // setInterval定时器
      this.smartTimerID = setInterval(() => {
        performEcharts()
      }, 5000)
    },

    // 切换actived
    switchActived(oldIndex, newIndex) {
      // 清除上一个元素的actived

      let oldIsLeft = oldIndex < 4 // 判断当前选中时是左侧还是右侧

      oldIndex = oldIndex % 4
      if (oldIsLeft) {
        this.eventGroupLeftData[oldIndex].isActived = false
      } else {
        this.eventGroupRightData[oldIndex].isActived = false
      }


      // 当前元素添加新的actived
      let newIsLeft = newIndex < 4

      newIndex = newIndex % 4
      if (newIsLeft) {
        this.eventGroupLeftData[newIndex].isActived = true
      } else {
        this.eventGroupRightData[newIndex].isActived = true
      }
    },


    // 点击事件函数
    currentEventGroup(current, index) {
      // 清除定时器
      clearInterval(this.smartTimerID)
      clearTimeout(this.timeoutId)

      //  点击时处理actived
      let { timerId } = this

      this.switchActived(timerId, index)


      // 赋予当前点击时的数据与索引
      this.current = current.typeCount
      this.timerId = index
      this.initEchart()


      // 延迟开启定时器
      this.timeoutId = setTimeout(() => {
        this.timerId = ++index
        this.smartAnalySetInterval()
      }, 3000)
    },

    // echarts 配置函数
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
        // title: {
        //   'x': '50%',
        //   'y': '50%',
        //   top: '50%', //字体的位置
        //   left: '50%',
        //   'text': '事件总数',
        //   'textStyle': {
        //     'fontWeight': 'normal',
        //     'color': '#11e7ff',
        //     'fontSize': 14
        //   }


        // },
        animationDuration: 1000,
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
                  y: pointStart[1],
                  x2: pointEnd1[0],
                  y2: pointEnd1[1],
                  colorStops: [
                  // !! 在此添加想要的渐变过程色 !!
                    { offset: 0, color: color },
                    { offset: 1, color: 'rgba(21,229,253,0.2)' }
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
  },

  // 组件销毁前清理定时器
  beforeDestroy() {
    clearInterval(this.smartDataId)
    clearInterval(this.smartTimerID)
  }
}
</script>

<style lang="scss" scoped>
.smart-analy {
  // overflow: hidden;
  // height: 0;
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
        font-size: 14px;

        .count-to-wrap {
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
      cursor: pointer;

      &:hover {
        background-image: url("./assets/smartanaly-hover.png");
      }
      &.actived {
        background-image: url("./assets/smartanaly-hover.png");
      }

      &:nth-child(n + 2) {
        margin-top: 12px;
      }

      & .smart-analy-title {
        padding: 0 10px;
        width: 80px;
        @include jc-text-warp(1);
      }
      & .smart-analy-count {
        width: 46px;
        text-align: right;
        padding-right: 6px;
      }
    }
  }
}
</style>
