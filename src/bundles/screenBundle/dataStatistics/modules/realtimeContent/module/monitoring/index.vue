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
            <div class="montitoring-title" v-text="video && video.name"></div>
            <!-- 监控视频存放位置 -->
            <div class="montitoring jc-flex-con">
              <div class="montitoring-video">
                <video :src="video && video.url" autoplay muted></video>
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
      videoDatas: []
    }
  },
  created() {
    this.$EventBus.$on('data-statistics-video-surveillance', this.initVideoData)
  },

  methods: {
    initVideoData(videoDatas) {
      this.videoDatas = videoDatas
      this.length = videoDatas.length

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
