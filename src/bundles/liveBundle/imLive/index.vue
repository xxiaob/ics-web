<template>
  <el-dialog class="imLive" title="视频通话" :visible.sync="dialogVisible" width="640px" :close-on-click-modal="false" :append-to-body="true" :close-on-press-escape="false" :show-close="false">
    <h2 class="title">{{msg}}</h2>

    <div v-if="invitedButton">
      <el-button type="primary" @click="agree">接受</el-button>
      <el-button type="danger" @click="refuse">拒绝</el-button>
    </div>
    <div class="jc-clearboth">
      <div id="live"></div>
    </div>
    <div class="jc-clearboth">
      <div id="tolive"></div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="exit">结束</el-button>
    </div>
  </el-dialog>

</template>

<script>
import { IM } from '@/live/im'
import { Live } from '@/live/agora'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')


export default {
  name: 'imLive',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object
    }
  },
  data() {
    return {
      msg: '音视频聊天',
      dialogVisible: false,
      channelId: '',
      invited: false, //我是邀请方
      //邀请类型
      inviteTypes: {
        '0': ['语音', ['0', '0', 'host']],
        '1': ['视频', ['0', '1', 'host']],
        '2': ['强制观摩', ['2', '1', 'audience']],
        '3': ['观摩', ['0', '1', 'audience']]
      },
      invitUserId: '', //邀请用户的id
      invitedButton: false, //接听按钮显示
      mediaType: '1',
      fromUsername: '' //哪个用户主动发消息过来
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.dialogVisible = newVal
        if (this.params) {
          const { inviteType, users, channelId } = this.params

          //设置频道id
          this.channelId = channelId ? channelId : new Date().getTime().toString()
          this.msg = '正在发起' + this.inviteTypes[inviteType][0]
          this.inviteAllUsers(...this.inviteTypes[inviteType][1], users)
        } else {
          console.log('我是接收方')
        }
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
      this.live = new Live(this.user.userId, 'live', 'tolive')
    }
    // setTimeout(()=>{
    //   this.$emit('update:visible', true)
    // }, 3000)
  },
  methods: {
    imMsgCb(onType, data) {
      console.log('vue 数据', onType, data)
      const { fromUsername, content: { channelId, msgType, agree, nickName, isExit, inviteType, mediaType } } = data

      this.fromUsername = fromUsername
      if (msgType === '1') {
        console.log('邀请视频')
        if (isExit) {
          //退出房间消息
          this.exitHandel(isExit)
        } else if (inviteType || agree) {
          //邀请消息
          if (this.invited) {
            this.inviteHandelMsg( agree, nickName)
          } else {
            this.$emit('update:visible', true)
            this.$emit('update:params', null)
            this.msg = nickName + '邀请你' + this.inviteTypes[inviteType][0]
            this.invitedHandelMsg({ channelId, mediaType, inviteType })
          }
        }
      } else {
        console.log('普通消息')
      }
    },
    exitHandel(nickName, isExit) {
      this.$message.warning(nickName + '已经挂断')
      if (isExit === '1') {
        console.log('结束视频')
        this.leaveChannel()
      }
    },
    //邀请方处理回来的信息
    inviteHandelMsg( agree, nickName) {
      if (agree === '1') {
        this.$message.success(nickName + '同意接听')
      } else {
        this.$message.warning(nickName + '拒绝接听')
      }
    },
    //我是被邀请方，处理回来的信息
    invitedHandelMsg({ channelId, mediaType, inviteType }) {
      this.channelId = channelId
      this.mediaType = mediaType
      if (inviteType === '1') {
        this.joinChannel()
      } else {
        this.invitedButton = true
        console.log('正常邀请')
      }
    },
    //加入频道
    joinChannel() {
      this.im.sendSingleMsg(this.fromUsername, {
        msgType: '1',
        channelId: this.channelId,
        agree: '1' // "0":拒绝邀请, "1":接受邀请,
      })

      const video = this.mediaType === '1' ? true : false

      //加入频道
      if (!this.live.joined) {
        this.live.joinChannel(this.channelId, 'host', video, this.invited)
      }
    },
    //同意加入频道
    agree() {
      this.joinChannel()
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
    //邀请所有用户加入频道
    //强制观摩 '2' , '1' , 'audience'
    //观摩 '0' , '1' , 'audience'
    //邀请语音通话 '0' , '0' , 'host'
    //邀请视频通话 '0' , '1' , 'host'
    inviteAllUsers(inviteType, mediaType, role, users) {
      this.invited = true
      const video = mediaType === '1' ? true : false

      //循环给用户发消息
      users.forEach(item=>{
        this.invitUserId = item
        this.inviteOneUser(inviteType, mediaType)
      })
      //加入频道
      if (!this.live.joined) {
        this.live.joinChannel(this.channelId, role, video, this.invited)
      }
    },
    //邀请单个用户加入频道
    inviteOneUser(inviteType, mediaType) {
      console.log(this.invitUserId, 'this.invitUserId')

      const content = this.params.inviteType === '3' ? 'observation' : ''
      const msg = {
        content,
        msgType: '1',
        nickName: this.user.userName,
        channelId: this.channelId,
        inviteDevice: '3', //"0":pc端, "1":移动端, "2":执法仪 , "3":全部
        inviteType, //"0":正常,"1":强拉 2":强制观摩(拉执法仪)
        mediaType //"0":音频,"1":视频
      }

      this.im.sendSingleMsg(this.invitUserId, msg)
    },
    //离开频道
    async leaveChannel() {
      await this.live.leaveChannel()
      this.msg = '视频通话结束'
      this.invited = false
      this.fromUsername = ''
    },
    //结束按钮操作
    exit() {
      this.$confirm('确认退出房间', '提示', { type: 'warning' }).then( () => {
        const isExit = this.invited ? '1' : '0'
        const msg = {
          msgType: '1',
          channelId: this.channelId,
          isExit
        }

        this.im.sendSingleMsg(this.invitUserId, msg)
        this.leaveChannel()
        this.dialogVisible = false
        this.$emit('update:visible', false)
        this.$emit('update:params', null)
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
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
