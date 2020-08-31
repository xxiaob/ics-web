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
              <img :src="video && video.href" alt="">
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
      videoPlayDatas: [],
      index: 0,
      videoDatas: [
        {
          name: '胜太路地铁站2号口',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MnoSAeCM9APhmVvFhpRo733.mp4',
          href: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598869647061&di=ee260345b4fc003a4a5a96d73d5a0552&imgtype=0&src=http%3A%2F%2Fimages.ali213.net%2Fpicfile%2Fpic%2F2013%2F06%2F09%2F927_ttt15.jpg',
          vid: 100001
        }, {
          name: '胜太路假日百货西门',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MnoSAeCM9APhmVvFhpRo733.mp4',
          href: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2873813226,4113011731&fm=26&gp=0.jpg',
          vid: 100002
        }, {
          name: '天印大道路口',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MnoSAeCM9APhmVvFhpRo733.mp4',
          href: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598869685190&di=5f7bc029a94cd4af8070839878107988&imgtype=0&src=http%3A%2F%2Fi9.download.fd.pchome.net%2Ft_960x600%2Fg1%2FM00%2F12%2F1B%2FoYYBAFbNA3qIKohQAAaCiymK3jkAAC3qwJ3iwsABoKj863.jpg',
          vid: 100003
        }, {
          name: '胜太路与双龙大道交通银行',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MnoSAeCM9APhmVvFhpRo733.mp4',
          href: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598869699320&di=30f443a78262e5dabfbfb4477bb16c4e&imgtype=0&src=http%3A%2F%2Fimg.tukexw.com%2Fimg%2Fe252c1486ab22f1d.jpg',
          vid: 100004
        }, {
          name: '金鹰与景枫交界路口',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MnoSAeCM9APhmVvFhpRo733.mp4',
          href: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1328718259,3277409477&fm=26&gp=0.jpg',
          vid: 100005
        }, {
          name: '机场线翠屏山站2号出口',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MnoSAeCM9APhmVvFhpRo733.mp4',
          href: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2371273780,436393634&fm=26&gp=0.jpg',
          vid: 100006
        }, {
          name: '双龙大道地铁口',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MnoSAeCM9APhmVvFhpRo733.mp4',
          href: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598869714860&di=42fd21e10f4c1a8fdc9f84a87fa28d0b&imgtype=0&src=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201511%2F03%2F20151103232149_jrC2e.jpeg',
          vid: 100007
        }, {
          name: '诚信大道与莱茵达路（球机）',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MnoSAeCM9APhmVvFhpRo733.mp4',
          href: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598869714859&di=c94ec60bb7034211aed2ef0fea0e14d9&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201201%2F31%2F20120131204752_rcFYP.jpg',
          vid: 100008
        }, {
          name: '地铁3号线胜太路站停车点',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MnoSAeCM9APhmVvFhpRo733.mp4',
          href: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1419661932,233835810&fm=26&gp=0.jpg',
          vid: 100009
        }, {
          name: '弘景大道格致路球',
          url: 'https://192.168.0.150:9000/group1/M00/00/68/wKgAeF9MnoSAeCM9APhmVvFhpRo733.mp4',
          href: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598869714858&di=6f6686cb5672cb5cf739779f26c1c798&imgtype=0&src=http%3A%2F%2Fimages.ali213.net%2Fpicfile%2Fpic%2F2013%2F04%2F09%2F927_hzw%2520%252815%2529.jpg',
          vid: 100010
        }
      ]
    }
  },
  mounted() {
    console.log('********************')

    this.setIntervalFun()
    this.initVideoData()
  },

  methods: {
    initVideoData() {
      this.length = this.videoDatas.length
      this.timer = setInterval(this.setIntervalFun, 4000)
    },
    setIntervalFun() {
      this.videoPlayDatas.forEach((item) => {
        let videoDatas = this.videoDatas[this.index]

        item.url = videoDatas.url
        item.name = videoDatas.name
        item.vid = videoDatas.vid
        item.href = videoDatas.href

        console.log('this.index', this.index)

        this.index = ++this.index % this.length

        console.log('index', this.index)
      })
      console.log('this.videoPlayDatas', this.videoPlayDatas)
      console.log('this.videoDatas', this.videoDatas)
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

          img {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
