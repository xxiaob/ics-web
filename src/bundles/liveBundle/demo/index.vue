<template>
  <div>
    <h1>直播demo</h1>
    <el-input v-model="channelId" placeholder="房间号"></el-input>
    <div>
      <el-button type="primary" @click="joinChannel" v-if="!inChannel">进入房间</el-button>
      <el-button @click="leaveChannel" v-if="inChannel">退出房间</el-button>
      <el-button type="primary" @click="inviteUser">邀请用户</el-button>
    </div>
    <div v-if="invitedButton">
      <el-button type="primary" @click="agree">接受</el-button>
      <el-button @click="refuse">拒绝</el-button>
    </div>
    <!-- <el-input v-model="username" placeholder="用户名 4-128"></el-input>
    <el-button type="primary" @click="register">注册</el-button>
    <el-input v-model="username" placeholder="用户名 4-128"></el-input>
    <el-button type="primary" @click="login">登录</el-button> -->
    <div>
      <div id="live"></div>
      <div id="tolive"></div>
    </div>

  </div>
</template>

<script>
import { IM } from '@/live/im'
import { Live } from '@/live'
export default {
  name: 'liveDemo',
  data() {
    return {
      username: 'lxy2',
      channelId: '123456',
      invited: false,
      invitedButton: false,
      mediaType: '1',
      fromUsername: '',
      inChannel: false
    }
  },
  created() {
    this.im = new IM(this.username)
    this.im.on(this.msgCb)
  },
  mounted() {
    this.live = new Live('live', 'tolive')
  },
  methods: {
    msgCb(data) {
      console.log('vue 数据', data)
      const { from_username: fromUsername, content: { msg_body: { text } } } = data.messages[0]

      this.fromUsername = fromUsername
      const msg = JSON.parse(text)

      if (this.invited) {
        if (msg.agree === '1') {
          console.log(this.fromUsername, '同意进入直播')
        } else {
          console.log(this.fromUsername, '拒绝进入直播')
        }
      } else {
        this.channelId = msg.channelId
        this.mediaType = msg.mediaType
        if (msg.inviteType === '1') {
          this.agreeJoinChannel()
        } else {
          this.invitedButton = true
          console.log('正常邀请', msg)
        }
      }
    },
    agreeJoinChannel() {
      this.im.sendSingleMsg(this.fromUsername, {
        channelId: this.channelId,
        agree: '1' // "0":拒绝邀请, "1":接受邀请
      })
      this.joinChannel()
    },
    agree() {
      this.agreeJoinChannel()
      this.invitedButton = false
    },
    refuse() {
      this.im.sendSingleMsg(this.fromUsername, {
        channelId: this.channelId,
        agree: '0' // "0":拒绝邀请, "1":接受邀请
      })
      this.invitedButton = false
    },
    register() {
      this.im.register(this.username)
    },
    login() {
      this.im.login(this.username)
    },
    inviteUser() {
      this.invited = true
      const msg = {
        channelId: this.channelId,
        content: 'content',
        inviteType: '0', //"0":正常,"1":强拉
        mediaType: '1' //"0":音频,"1":视频
      }

      this.im.sendSingleMsg('lxx123', msg)
      if (!this.live.inChannel) {
        this.joinChannel()
      }
    },
    async joinChannel() {
      await this.live.joinChannel(this.channelId)
      this.inChannel = true
    },
    async leaveChannel() {
      await this.live.leaveChannel()
      this.invited = false
      this.inChannel = false
    }
  }
}
</script>

<style lang="scss" scoped>
#live,
#tolive {
  width: 300px;
  height: 200px;
  display: inline-block;
}
</style>
