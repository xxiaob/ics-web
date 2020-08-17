<template>
  <div class="jc-video-warp" :class="{'jc-warp-show': show}">
    <div class="jc-warp-title">视频播放<i class="jc-video-close el-icon-close" @click="closeVideos"></i></div>
    <div class="jc-video-item" v-for="(item,index) in list" :key="item.deviceId" :class="item.deviceId == fullId ? 'jc-video-full': `jc-video-${index}`">
      <i class="jc-item-close el-icon-close" @click="videoClose(item)"></i>
      <div class="jc-video-header">
        <div class="jc-video-title" v-text="item.name"></div>
        <i class="jc-controll-item el-icon-full-screen" @click="videoFull(item)"></i>
      </div>
      <div class="jc-video-play video-js vjs-default-skin" :id="item.userId || item.deviceId"></div>
    </div>
  </div>
</template>
<script>
import { getLiveStreaming } from '@/api/device'
import { DEVICE_TYPES } from '@/constant/Dictionaries'

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
    // let index = 0

    // setInterval(() => {
    //   this.list.splice(0, 0, { id: index++, name: '设备' + index })
    //   //处理列表只显示最大数量的事件问题
    //   if (this.list.length > this.maxLength) {
    //     this.list.splice(this.maxLength, this.list.length - this.maxLength)
    //   }
    // }, 15000)
  },
  methods: {
    async videoPlay(devices) {
      //播放内容
      console.log('video-warp-deviceIds', devices)
      if (!devices || devices.length < 1) {
        return
      }

      try {
        let deviceIds = [], playList = {} //存储id 数组，需要重新播放的列表

        //处理该设备id 是否已经在播放列表，如果已经在则不进行请求查询
        devices.forEach(item => {
          if (!videos[item.deviceId]) {
            deviceIds.push(item.deviceId)
            playList[item.deviceId] = { deviceId: item.deviceId, name: item.name }
          }
        })

        let result = await getLiveStreaming({ deviceIds })

        if (result && result.length) {
          result.forEach(item => {

          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    closeVideos() {
      //关闭所有视频
      this.list = []
    },
    videoClose(item) {
      if (item.id == this.fullId) {
        //如果是放大的视频则缩小
        this.fullId = null
      } else {
        //关闭单个视频
        let index = this.list.findIndex(videoItem => videoItem.id == item.id)

        if (index > -1) {
          this.list.splice(index, 1)
        }
      }
    },
    videoFull(item) {
      //全屏播放
      this.fullId = item.id
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('device-video-play', this.videoPlay) //监听视频播放
  }
}
</script>
