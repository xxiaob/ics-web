<template>
  <el-dialog title="视频通话" :visible.sync="dialogVisible" width="640px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <div>imLive</div>
    <div>
      <div v-if="inChannel">
        <el-button @click="exit('1')" v-if="invited">结束聊天</el-button>
        <el-button @click="exit('0')" v-else>退出房间</el-button>
      </div>
    </div>
    <div v-if="invitedButton">
      <el-button type="primary" @click="agree">接受</el-button>
      <el-button @click="refuse">拒绝</el-button>
    </div>
    <div class="jc-clearboth">
      <div id="live"></div>
    </div>
    <div class="jc-clearboth">
      <div id="tolive"></div>
    </div>
  </el-dialog>

</template>

<script>
import { IM } from '@/live/im'
import { Live } from '@/live/agora'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')


export default {
  name: 'live',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      channelId: '123456',
      invited: false,
      invitUserId: '',
      invitedButton: false,
      mediaType: '1',
      fromUsername: '',
      inChannel: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.dialogVisible = newVal
      }
    }
  },
  created() {
    this.im = new IM(this.user.userId, this.user.userName)
    this.im.on(this.imMsgCb)
  },
  mounted() {
    if (this.live) {
      console.log('直播客户端已经初始化')
    } else {
      this.live = new Live('live', 'tolive')
    }
    // setTimeout(()=>{
    //   this.$emit('update:visible', true)
    // }, 3000)
  },
  methods: {
    imMsgCb(onType, data) {
      console.log('vue 数据', onType, data)
      const { fromUsername, content } = data

      this.fromUsername = fromUsername
      if (content.msgType === '1') {
        console.log('邀请视频')
        if (content.isExit) {
          //退出房间消息
          this.exitHandel(content.isExit)
        } else if (content.inviteType || content.agree) {
          //邀请消息
          if (this.invited) {
          //我是邀请方，处理回来的信息
            this.inviteHandelMsg(content)
          } else {
          //我是被邀请方，处理回来的信息
            this.invitedHandelMsg(content)
          }
        }
      } else {
        console.log('普通消息')
      }
    },
    exitHandel(isExit) {
      if (isExit === '1') {
        console.log('结束视频')
        this.leaveChannel()
      } else {
        console.log(this.fromUsername, '退出房间')
      }
    },
    inviteHandelMsg(content) {
      if (content.agree === '1') {
        console.log(this.fromUsername, '同意进入直播')
      } else {
        console.log(this.fromUsername, '拒绝进入直播')
      }
    },
    invitedHandelMsg(content) {
      this.channelId = content.channelId
      this.mediaType = content.mediaType
      if (content.inviteType === '1') {
        this.agreeJoinChannel()
      } else {
        this.invitedButton = true
        console.log('正常邀请', content)
      }
    },
    //同意加入频道
    agreeJoinChannel() {
      this.im.sendSingleMsg(this.fromUsername, {
        msgType: '1',
        channelId: this.channelId,
        agree: '1' // "0":拒绝邀请, "1":接受邀请,
      })
      this.joinChannel()
    },
    agree() {
      this.agreeJoinChannel()
      this.invitedButton = false
    },
    //拒绝加入频道
    refuse() {
      this.im.sendSingleMsg(this.fromUsername, {
        msgType: '1',
        channelId: this.channelId,
        agree: '0' // "0":拒绝邀请, "1":接受邀请
      })
      this.invitedButton = false
    },
    //邀请用户加入频道
    inviteUser() {
      this.invited = true
      const msg = {
        msgType: '1',
        channelId: this.channelId,
        content: 'content',
        inviteType: '0', //"0":正常,"1":强拉
        mediaType: '1' //"0":音频,"1":视频
      }

      this.im.sendSingleMsg(this.invitUserId, msg)
      if (!this.live.inChannel) {
        this.joinChannel()
      }
    },
    //加入频道
    async joinChannel() {
      await this.live.joinChannel(this.channelId)
      this.inChannel = true
    },
    async leaveChannel() {
      await this.live.leaveChannel()
      this.invited = false
      this.inChannel = false
      this.fromUsername = ''
    },
    exit(isExit) {
      const msg = {
        msgType: '1',
        channelId: this.channelId,
        isExit
      }

      this.im.sendSingleMsg(this.invitUserId, msg)
      this.leaveChannel()
    },
    dialogClose() {
      this.$emit('update:visible', false)
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
</style>
