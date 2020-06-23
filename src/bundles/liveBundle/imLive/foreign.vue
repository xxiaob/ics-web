<template>
  <div id="tolive"></div>
</template>

<script>
import { IM } from '@/live/im'
import { Live } from '@/live/agora'
import { setToken } from '@/libs/storage'

export default {
  name: 'foreign',
  data() {
    return {
      user: {
        userId: '56783679036325888',
        userName: '李向玉南京'
      },
      invitUserId: '',
      channelId: '',
      onCall: false
    }
  },
  created() {
    console.log('this.$route', this.$route.query)
    const { token, userId, userName } = this.$route.query

    this.user = {
      userId, userName
    }
    setToken(token)
    this.im = new IM(this.user.userId, this.user.userName)
    this.im.on(this.imMsgCb)
  },
  mounted() {
    if (this.live) {
      console.log('直播客户端已经初始化')
    } else {
      this.live = new Live(this.user.userId, 'live', 'tolive')
    }

    //监听postmessage
    window.addEventListener('message', e=> {
      const { userId, start, stop } = e.data

      if (start) {
        this.invitUserId = userId
        this.inviteUser()
        console.log('开始强制观摩', userId)
      }
      if (stop) {
        this.exit()
        console.log('停止强制观摩')
      }
    }, false)
  },
  methods: {
    imMsgCb(onType, data) {
      console.log('vue 数据', onType, data)
      const { content: { agree, nickName, isExit } } = data

      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      if (this.loading) {
        this.loading.close()
      }

      if (agree === '1') {
        this.onCall = true
        this.$message.success('正在强制观摩' + nickName)
      }
      if (isExit) {
        this.onCall = false
        this.$message.warning(nickName + '已经挂断')
        this.leaveChannel()
      }
    },
    //强制观摩
    inviteUser() {
      this.timeout = setTimeout(()=>{
        this.$message.warning('对方不在线')
        clearTimeout(this.timeout)
        if (this.loading) {
          this.loading.close()
        }
      }, 30000)

      this.loading = this.$loading({ text: '正在发起强制观摩...' })

      this.channelId = new Date().getTime().toString()
      const msg = {
        msgType: '1',
        nickName: this.user.userName,
        channelId: this.channelId,
        inviteDevice: '2',
        inviteType: '2', //"0":正常,"1":强拉 2":强制观摩(拉执法仪)
        mediaType: '1' //"0":音频,"1":视频
      }

      this.im.sendSingleMsg(this.invitUserId, msg)
      if (!this.live.joined) {
        this.live.joinChannel(this.channelId, 'audience', false)
      }
    },
    //结束聊天
    exit() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      if (this.loading) {
        this.loading.close()
      }

      if (this.onCall) {
        const msg = {
          msgType: '1',
          nickName: this.user.userName,
          channelId: this.channelId,
          inviteDevice: '2',
          isExit: '1'
        }

        this.im.sendSingleMsg(this.invitUserId, msg)
      }
      this.leaveChannel()
    },
    async leaveChannel() {
      if (this.live.joined) {
        await this.live.leaveChannel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#tolive {
  width: 100%;
  height: 100%;
}
</style>
