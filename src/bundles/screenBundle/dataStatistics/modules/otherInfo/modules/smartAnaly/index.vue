<template>
  <div class="smart-analy jc-flex-warp">
    <jc-abstract-area title="AI 智能分析">
      <div class="smart-analy-content jc-flex-warp jc-flex-con">

        <div class="smart-analy-left jc-flex-con-2 jc-flex-warp jc-flex-vertical">
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">占道经营</span>
            <span>
              <count-to :startVal="0" :endVal="339" /> 件
            </span>
          </div>
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">机动车乱停</span>
            <span>
              <count-to :startVal="0" :endVal="39" /> 件
            </span>
          </div>
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">乱堆物料</span>
            <span>
              <count-to :startVal="0" :endVal="39" /> 件
            </span>
          </div>
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">店外经营</span>
            <span>
              <count-to :startVal="0" :endVal="39" /> 件
            </span>
          </div>
        </div>

        <div class="smart-analy-center jc-flex-con-3">
          <jc-charts :options="options"></jc-charts>
          <div class="smart-analy-count jc-flex-warp">
            <div class="count-to-wrap">
              <count-to :startVal="0" :endVal="current" /> 件
            </div>
          </div>
        </div>

        <div class="smart-analy-right jc-flex-con-2 jc-flex-warp jc-flex-vertical">
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">沿街晾晒</span>
            <span>
              <count-to :startVal="0" :endVal="339" /> 件
            </span>
          </div>
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">乱拉横幅</span>
            <span>
              <count-to :startVal="0" :endVal="39" /> 件
            </span>
          </div>
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">暴露垃圾</span>
            <span>
              <count-to :startVal="0" :endVal="86" /> %
            </span>
          </div>
          <div class="smart-analy-item jc-flex-con jc-flex-warp">
            <span class="smart-analy-title">非机动车乱停</span>
            <span>
              <count-to :startVal="0" :endVal="39" /> 件
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

export default {
  name: 'ScreenDataStatisticsOtherInfoSmartAnaly',
  components: { JcAbstractArea, countTo, JcCharts },
  data() {
    return {
      current: 90, // 当前事件数
      total: 100// 总事件数
    }
  },
  created() {
    let eventPrecent = this.current / this.total

    let precent = eventPrecent * 268 // 计算比例

    let color = 'rgba(21,229,253,1)'

    let duration = 6000

    if ((eventPrecent * 100) < 30) {
      color = 'rgba(21,229,253,0.4)'
      duration = 14000
    } else if ((eventPrecent * 100) < 60) {
      color = 'rgba(21,229,253,0.6)'
      duration = 10000
    } else if ((eventPrecent * 100) < 80) {
      color = 'rgba(21,229,253,0.8)'
      duration = 8000
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
        animationDuration: duration,
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
