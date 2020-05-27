<template>
  <div>
    <h1>直播demo</h1>
    <el-input v-model="channelId" placeholder="房间号"></el-input>
    <el-button type="primary" @click="joinChannel">进入房间</el-button>
    <el-button @click="leaveChannel">退出房间</el-button>
    <div id="live"></div>
    <div id="tolive"></div>
    <!-- <video id="test"></video> -->
  </div>
</template>

<script>
import { Live } from '@/live'
export default {
  name: 'liveDemo',
  data() {
    return {
      channelId: '123456'
    }
  },
  mounted() {
    this.live = new Live()
    // hwplayerloaded(function () {
    //   let options = {
    //     //是否显示控制栏，包括进度条，播放暂停按钮，音量调节等组件
    //     controls: true,
    //     width: 640,
    //     height: 360
    //   }
    //   var player = new HWPlayer('test', options, function () {
    //     //播放器已经准备好了
    //     player.src('rtmp://play.bg365.top/live/aaa')
    //     // "this"指向的是HWPlayer的实例对象player
    //     player.play()
    //     // 使用事件监听
    //     player.on('ended', function () {
    //       //播放结束了
    //     })
    //   })
    // })
  },
  methods: {
    joinChannel() {
      this.live.joinChannel(this.channelId)
    },
    leaveChannel() {
      this.live.leaveChannel()
    }
  }
}
</script>

<style lang="scss" scoped>
#live,
#tolive {
  width: 500px;
  height: 400px;
}
</style>
