<template>
  <div class="jc-video-warp" :class="{'jc-warp-show': show}">
    <div class="jc-warp-title">视频播放<i class="jc-video-close el-icon-close" @click="closeVideos"></i></div>
    <div class="jc-video-item" v-for="(item,index) in list" :key="item.deviceId" :class="item.deviceId == fullId ? 'jc-video-full': `jc-video-${index}`">
      <i class="jc-item-close el-icon-close" @click="videoClose(item)"></i>
      <div class="jc-video-header">
        <div class="jc-video-title" v-text="item.name"></div>
        <i class="jc-controll-item el-icon-full-screen" @click="videoFull(item)"></i>
      </div>
      <div class="jc-video-play" v-if="item.userId" :id="item.userId"></div>
      <div class="jc-video-play" v-else>
        <video class="video-js vjs-default-skin" :id="`device${item.deviceId}`"></video>
      </div>
    </div>
  </div>
</template>
<script>
import { getLiveStreaming } from '@/api/device'

let videos = {} //用于存储所有video，方便清除

export default {
  name: 'ScreenCommandVideoWarp',
  data() {
    return {
      list: [],
      fullId: null, //全屏的id
      maxLength: 4 //设置最多显示4个
    }
  },
  computed: {
    show() {
      return this.list.length > 0
    }
  },
  created() {
    this.$EventBus.$on('device-video-play', this.videoPlay) //监听视频播放
    this.$EventBus.$on('notice-compulsory-observation-leave', this.userLeave) //设备用户离开
  },
  methods: {
    async videoPlay(devices) {
      //播放内容
      console.log('video-warp-deviceIds', devices)
      if (!devices || devices.length < 1) {
        return
      }

      try {
        this.list = devices.filter(item=>item.hls)

        const noUrlDevices = devices.filter(item=>!item.hls)

        if (noUrlDevices.length) {
          let list = []

          let result = await getLiveStreaming({ deviceIds: noUrlDevices.map(device => device.deviceId) })

          if (result && result.length) {
            result.forEach(item => {
              let device = devices.find(deviceItem => deviceItem.deviceId == item.deviceId)

              list.push({ ...item, name: device.name })
            })
            //对增加的和需要播放的进行合并
            for (let i = 0; i < this.list.length; i++) {
              let item = this.list[i]

              //查看是否已经存在，如果不存在，则添加，否则不处理
              let index = list.findIndex(device => device.deviceId == item.deviceId)

              if (index < 0) {
                list.push({ ...item })
              }
              //如果达到播放数量，则剩余的抛弃
              // if (list.length >= this.maxLength) {
              //   break
              // }
            }
            this.list = list.splice(0, this.maxLength)
          }
        }

        this.goVideoPlay()
      } catch (error) {
        console.log(error)
      }
    },
    goVideoPlay() {
      /**
       * 播放视频，先处理已经失效的视频
       * 然后去循环播放列表视频
       */
      for (let deviceId in videos) {
        let index = this.list.findIndex(device => device.deviceId == deviceId)

        if (index < 0) {
          let device = videos[deviceId]

          if (device.userId) {
            this.$EventBus.$emit('notice-compulsory-observation', { type: 'stop', userId: device.userId })
          } else {
            device.player.dispose()
            device.player = null
            delete videos[deviceId]
          }
        }
      }
      this.$nextTick(() => {
        this.list.forEach(item => {
          if (!item[item.deviceId]) {
            let playItem = { ...item }

            //如果用户id 存在
            if (item.userId) {
              playItem.player = item.userId
              this.$EventBus.$emit('notice-compulsory-observation', { type: 'start', userId: item.userId })
            } else {
              playItem.player = videojs('device' + item.deviceId, {
                sources: [{ src: item.hls }], //'rtmp://58.200.131.2:1935/livetv/hunantv'
                controls: true,
                autoplay: true
              }, function () {
                console.log('执行 播放回调方法')
                this.one('play', () => {
                  console.log('开始播放')
                  this.addClass('vjs-seeking')
                })

                this.one('loadeddata', () => {
                  setTimeout(() => {
                    this.el().style.width = '100%'
                    this.removeClass('vjs-seeking')
                  }, 1000)
                })
              })
            }
            videos[item.deviceId] = playItem
          }
        })
      })
    },
    closeVideos() {
      //关闭所有视频
      this.list = []
      this.goVideoPlay()
    },
    userLeave(data) {
      let index = this.list.findIndex(videoItem => videoItem.userId == data.userId)

      if (index > -1) {
        this.list.splice(index, 1)
        this.goVideoPlay()
      }
    },
    videoClose(item) {
      if (item.deviceId == this.fullId) {
        //如果是放大的视频则缩小
        this.fullId = null
      } else {
        //关闭单个视频
        let index = this.list.findIndex(videoItem => videoItem.deviceId == item.deviceId)

        if (index > -1) {
          this.list.splice(index, 1)
          this.goVideoPlay()
        }
      }
    },
    videoFull(item) {
      //全屏播放
      this.fullId = item.deviceId
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('device-video-play', this.videoPlay) //监听视频播放
    this.$EventBus.$off('notice-compulsory-observation-leave', this.userLeave) //设备用户离开
    videos = {} //清空所有的视频数据
  }
}
</script>
