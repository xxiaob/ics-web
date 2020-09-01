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
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N8vGAWaKDChIkd2gD1rs594.mp4',
          vid: 100001
        }, {
          name: '诚信大道与莱茵达路（球机）',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MuzeAHa4mCtC7rH8lMeo350.mp4',
          vid: 100002
        }, {
          name: '弘景大道格致路球1',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9Mu6CAOYbgDyeUXwQ1r1s080.mp4',
          vid: 100003
        }, {
          name: '将军大道天元西路路口2',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9Mu8SAThrqENFVtfREMP8681.mp4',
          vid: 100004
        }, {
          name: '天元路与天印大道2（球机）',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MvAOAZgpRCY8F6XfAmHc401.mp4',
          vid: 100005
        }, {
          name: '文鼎商业广场（枪机2）',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MvCeAXbVKCT0gWmud8AA813.mp4',
          vid: 100006
        }, {
          name: '胜太路假日百货西门',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N8y6AWMdfC0wnOqYK77c396.mp4',
          vid: 100007
        }, {
          name: '天印大道路口',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N82iAf-KBCl9y-QdgsMM599.mp4',
          vid: 100008
        }, {
          name: '胜太路与双龙大道交通银行',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N85aAZi5YC3cDAGvZPQc196.mp4',
          vid: 100009
        }, {
          name: '金鹰与景枫交界路口',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N88mACiotDH7kZa697eo658.mp4',
          vid: 100010
        }, {
          name: '机场线翠屏山站2号出口',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N9BqAafs0Cvf-S_6V_FY015.mp4',
          vid: 100011
        }, {
          name: '双龙大道地铁口',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N9ESAJfpnCssWUI2IIzM329.mp4',
          vid: 100012
        }, {
          name: '地铁3号线胜太路站停车点4',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N9HyAY2HbCnepb9sCfTM723.mp4',
          vid: 100013
        }, {
          name: '江宁区双龙大道金鹰东门违停球1',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N9NCAPD-wCsGZxZEnDyo257.mp4',
          vid: 100014
        }, {
          name: '将军大道天元西路路口2',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N9RaAcq9pENFVtfREMP8755.mp4',
          vid: 100015
        }, {
          name: '金箔路竹山路路口2',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N9T6ARwkvC4gntiowotA347.mp4',
          vid: 100016
        }, {
          name: '龙眠大道月华路路口2',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N9WmAbqhFCz3hMlZIIPk517.mp4',
          vid: 100017
        }, {
          name: '天印大道上元大街路口南抓拍机1',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N9Y-ANQySBFFP204XMW0529.mp4',
          vid: 100018
        }, {
          name: '天印大道与金箔路',
          url: 'https://192.168.0.150:9000/group1/M00/00/69/wKgAeF9N9b6AeZeCDCUhYeNj8XQ344.mp4',
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
