<template>
  <div>
    <h1>直播demo</h1>
    <el-input v-model="channelId" placeholder="房间号"></el-input>
    <el-button type="primary" @click="joinChannel">进入房间</el-button>
    <el-button @click="leaveChannel">退出房间</el-button>
    <div id="live"></div>
    <div id="tolive"></div>
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
