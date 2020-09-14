<template>
  <div class="jc-monitoring">
    <jc-abstract-area title="监控视频">
      <!-- 标题插槽内容 -->
      <div class="jc-right-box" slot="title">
        <span class="jc-right-item" :class="{'jc-activated':activated===1}" @click="changeType(1)">重点区域</span>|
        <span class="jc-right-item" :class="{'jc-activated':activated===2}" @click="changeType(2)">网巡车</span>|
        <span class="jc-right-item" :class="{'jc-activated':activated===3}" @click="changeType(3)">无人机</span>
      </div>

      <!-- 默认插槽内容 -->
      <div class="js-monitoring-content jc-flex-warp">
        <div class="jc-monitoring-wrap" v-for="video in videoPlayDatas" :key="video.id">
          <div class="monitoring-wrap data-statistics-border jc-flex-warp jc-flex-vertical">
            <div class="montitoring-title" v-text="video.name"></div>
            <!-- 监控视频存放位置 -->
            <div class="montitoring jc-flex-con">
              <div class="montitoring-video">
                <video :src="video.url" autoplay muted></video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </jc-abstract-area>
  </div>

</template>

<script>
// 标题抽象组件
import JcAbstractArea from '../../../common/abstractArea'

export default {
  name: 'ScreenDataStatisticsRealtimeContentMonitoring',
  components: {
    JcAbstractArea
  },
  data() {
    return {
      activated: 1,
      videoPlayDatas: [{}, {}, {}, {}],
      index: 0,
      videoDatas: [
        {
          name: '胜太路地铁站2号口',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d7eCAJSMEChIkd2gD1rs138.mp4',
          vid: 100001
        }, {
          name: '诚信大道与莱茵达路（球机）',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d7kCAD-TlCtC7rH8lMeo843.mp4',
          vid: 100002
        }, {
          name: '弘景大道格致路球1',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d7r6AAj2kDyeUXwQ1r1s125.mp4',
          vid: 100003
        }, {
          name: '将军大道天元西路路口2',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d7zqAPbyZENFVtfREMP8726.mp4',
          vid: 100004
        }, {
          name: '天元路与天印大道2（球机）',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d77GAZUzbCY8F6XfAmHc600.mp4',
          vid: 100005
        }, {
          name: '文鼎商业广场（枪机2）',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d8C-AQgt2CT0gWmud8AA190.mp4',
          vid: 100006
        }, {
          name: '胜太路假日百货西门',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d8KCANFEyC0wnOqYK77c670.mp4',
          vid: 100007
        }, {
          name: '天印大道路口',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d8O6ABhRFCl9y-QdgsMM980.mp4',
          vid: 100008
        }, {
          name: '胜太路与双龙大道交通银行',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d8VeAQXs7C3cDAGvZPQc842.mp4',
          vid: 100009
        }, {
          name: '金鹰与景枫交界路口',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d8auAVNgZDH7kZa697eo695.mp4',
          vid: 100010
        }, {
          name: '机场线翠屏山站2号出口',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d8X6AVHyBCvf-S_6V_FY189.mp4',
          vid: 100011
        }, {
          name: '双龙大道地铁口',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d8T-AckbRCssWUI2IIzM744.mp4',
          vid: 100012
        }, {
          name: '地铁3号线胜太路站停车点4',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d8P-AR-M3Cnepb9sCfTM336.mp4',
          vid: 100013
        }, {
          name: '江宁区双龙大道金鹰东门违停球1',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d8LeAKA22CsGZxZEnDyo704.mp4',
          vid: 100014
        }, {
          name: '将军大道天元西路路口2',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d8H-AfUxNENFVtfREMP8731.mp4',
          vid: 100015
        }, {
          name: '金箔路竹山路路口2',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d8DSAdQ8VC4gntiowotA716.mp4',
          vid: 100016
        }, {
          name: '龙眠大道月华路路口2',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d7-KAClSkCz3hMlZIIPk404.mp4',
          vid: 100017
        }, {
          name: '天印大道上元大街路口南抓拍机1',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d76qAbChmBFFP204XMW0836.mp4',
          vid: 100018
        }, {
          name: '天印大道与金箔路',
          url: 'https://nanjing.jingliangsys.cn:88/gwy-fast/group1/M00/02/53/wKgCMl9d7faAVNEEDCUhYeNj8XQ282.mp4',
          vid: 100019
        }
      ]
    }
  },
  created() {
    this.initVideoData()
  },

  methods: {
    initVideoData() {
      this.length = this.videoDatas.length

      // 初始执行
      this.setIntervalFun()

      // 定时器
      this.timer = setInterval(this.setIntervalFun, 60 * 1000)
    },
    setIntervalFun() {
      this.videoPlayDatas.forEach((item) => {
        let videoDatas = this.videoDatas[this.index]

        item.url = videoDatas.url
        item.name = videoDatas.name
        item.vid = videoDatas.vid
        item.href = videoDatas.href


        this.index = ++this.index % this.length
      })
      this.$forceUpdate()
    },
    changeType(val) {
      if (val !== this.activated) {
        this.activated = val
      } else {
        console.log('请勿重复点击')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-monitoring {
  margin-bottom: 20px;
  .js-monitoring-content {
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    padding: 16px;

    .jc-monitoring-wrap {
      width: 50%;
      height: 50%;

      &:nth-child(odd) {
        padding-right: 8px;
      }
      &:nth-child(even) {
        padding-left: 8px;
      }
      &:nth-child(-n + 2) {
        padding-bottom: 6px;
      }
      &:nth-child(n + 3) {
        padding-top: 6px;
      }

      .monitoring-wrap {
        width: 100%;
        height: 100%;
        padding: 0 12px 12px;
        text-align: center;
        background-color: #00125d;

        .montitoring-title {
          height: 38px;
          line-height: 38px;
          font-size: 14px;
          color: #ffffff;
        }

        .montitoring {
          position: relative;
          width: 100%;
          padding-top: 64%;
          background: url("./assets/video-space.png") no-repeat center / cover;

          .montitoring-video {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 99;
            width: 100%;
            height: 100%;

            video {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: fill;
            }
          }
        }
      }
    }
  }
}
</style>
