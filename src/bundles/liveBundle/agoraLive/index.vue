<template>
  <div>
    <h1>agora直播demo</h1>
    <el-input v-model="channelId" placeholder="房间号"></el-input>
    <div>
      <el-button type="primary" @click="joinChannel">进入房间</el-button>
      <el-button type="primary" @click="leaveChannel">离开房间</el-button>
    </div>
    <div class="jc-clearboth">
      <div id="live"></div>
      <div id="tolive"></div>
    </div>
  </div>
</template>

<script>
import { Live } from '@/live/agora'

export default {
  data() {
    return {
      channelId: '123456'
    }
  },
  mounted() {
    this.live = new Live('live', 'tolive')
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
  width: 300px;
  height: 200px;
  float: left;
}
.jc-clearboth::before,
.jc-clearboth::after {
  display: table;
  content: "";
  clear: both;
}
.video-js {
  float: left;
}
</style>
