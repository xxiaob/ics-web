<template>
  <div class="jc-main-container-warp">
    <video-filter @filter="goFilter" :detail="detail">
      <template v-slot:back>
        <el-button icon="el-icon-back" size="small" @click="back" style="margin-right:20px">返回</el-button>
      </template>
    </video-filter>
    <el-card class="jc-table-card jc-mt">
      <video v-if="showVideo" id="myVideo" class="jc-video video-js vjs-default-skin"></video>
    </el-card>
  </div>
</template>
<script>
import { getRelay } from '@/api/device'

export default {
  name: 'SystemDeviceCameraVideo',
  props: {
    detail: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      filter: {},
      showVideo: false
    }
  },
  components: {
    VideoFilter: () => import('../videoFilter')
  },
  watch: {
    detail: {
      immediate: true,
      deep: true,
      handler() {
        this.initData()
      }
    }
  },
  mounted() {

  },
  methods: {
    async initData() {
      const that = this

      if (this.video) {
        this.video.dispose()
      }
      this.showVideo = false

      if (this.detail && this.detail.deviceId && this.filter && this.filter.startTime) {
        try {
          const { deviceId, cameraId } = this.detail
          const res = await getRelay({ deviceId, cameraId, ...this.filter })

          // 'http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8'  rtmp://58.200.131.2:1935/livetv/hunantv
          if (res && res[0] && res[0].url1) {
            this.showVideo = true
            this.$nextTick(()=>{
              this.video = videojs('myVideo', {
                sources: [
                  {
                  // src: 'rtmp://58.200.131.2:1935/livetv/hunantv'
                    src: res[0].url1
                  // type: 'rtmp/flv'
                  }
                ],
                controls: true,
                autoplay: true
              }, function () {
                this.on('loadstart', function () {
                  console.log('videojs -- 开始请求数据')
                })
                this.on('error', ()=> {
                  console.log('videojs -- 加载错误')
                  this.$message.error('视频加载错误')
                  this.dispose()
                  that.showVideo = false
                })
              })
            })
          } else {
            this.$message.error('当前时间段没有视频')
          }
        } catch (error) {
          console.error(error)
        }
      }
    },
    goFilter(filter) {
      this.filter = filter
      this.initData()
    },
    back() {
      this.$parent.checkShow('index')
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-table-card /deep/ .el-card__body {
  padding: 20px;
}
.jc-video {
  margin: 0 auto;
  width: 100vh;
  position: relative;
  video {
    width: 100%;
  }
}
.myVideo-dimensions {
  max-height: 70vh;
}
</style>
