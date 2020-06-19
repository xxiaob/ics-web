<template>
  <el-dialog class="imLive" title="视频通话" :visible.sync="dialogVisible" width="840px" :close-on-click-modal="false" :append-to-body="true" :close-on-press-escape="false" :show-close="false">
    <div class="content" v-show="contentShow">
      <div id="tolive">
        <div id="live" v-show="myShow"></div>
      </div>
    </div>
    <h3 class="title">{{msg}}</h3>
    <div slot="footer" class="dialog-footer">
      <span class="invitedButton" v-if="invitedButton">
        <img class="gif" src="./assets/help.gif" alt="" width="50">
        <img class="btn" src="./assets/answer.png" alt="" width="50" @click="agree" title="接听">
        <img class="btn" src="./assets/hangup.png" alt="" width="50" @click="refuse" title="挂断">
      </span>
      <img src="./assets/hangup.png" alt="" width="50" @click="exit" v-show="contentShow" title="挂断">
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
      msg: '音视频通话',
      dialogVisible: false,
      contentShow: false,
      myShow: false,
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
      fromUsername: '', //哪个用户主动发消息过来
      observation: false
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
      const { fromUsername, content: { channelId, msgType, agree, nickName, isExit, inviteType, mediaType, content } } = data

      this.fromUsername = fromUsername
      if (msgType === '1') {
        console.log('邀请视频')
        if (isExit) {
          //退出房间消息
          this.exitHandel({ nickName, isExit })
        } else if ( agree) {
          //邀请消息 我是邀请方
          this.inviteHandelMsg( agree, nickName)
        } else if (inviteType) {
          //我是被邀请方
          this.$emit('update:visible', true)
          this.$emit('update:params', null)

          if (inviteType === '0') {
            let msg = content === 'help' ? '一键求助' : (mediaType === '0' ? '语音' : '视频')

            this.msg = nickName + '邀请你' + msg
          }
          this.invitedHandelMsg({ channelId, mediaType, inviteType })
        }
      } else {
        console.log('普通消息')
      }
    },
    exitHandel({ nickName, isExit }) {
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
      this.msg = ''
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
        nickName: this.user.userName,
        agree: '1' // "0":拒绝邀请, "1":接受邀请,
      })

      const video = this.mediaType === '1' ? true : false

      //加入频道
      if (!this.live.joined) {
        this.contentShow = true
        this.myShow = true
        this.live.joinChannel(this.channelId, 'host', video, this.invited)
      }
    },
    //同意加入频道
    agree() {
      this.joinChannel()
      this.invitedButton = false
      this.msg = ''
    },
    //拒绝加入频道
    refuse() {
      this.im.sendSingleMsg(this.fromUsername, {
        msgType: '1',
        nickName: this.user.userName,
        channelId: this.channelId,
        agree: '0' // "0":拒绝邀请, "1":接受邀请
      })
      this.invitedButton = false
      this.leaveChannel()
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
        this.contentShow = true
        if (role === 'host') {
          this.myShow = true
        } else {
          this.myShow = false
        }
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
      if (this.live.joined) {
        await this.live.leaveChannel()
      }
      this.msg = ''
      this.invited = false
      this.fromUsername = ''
      this.contentShow = false
      this.myShow = false
      this.dialogVisible = false
      this.$emit('update:visible', false)
      this.$emit('update:params', null)
    },
    //结束按钮操作
    exit() {
      this.$confirm('确认退出房间', '提示', { type: 'warning' }).then( () => {
        const isExit = this.invited ? '1' : '0'
        const msg = {
          msgType: '1',
          channelId: this.channelId,
          nickName: this.user.userName,
          isExit
        }

        if (this.invited) {
          this.params.users.forEach(item=>{
            this.im.sendSingleMsg(item, msg)
          })
        } else {
          this.im.sendSingleMsg(this.fromUsername, msg)
        }
        this.leaveChannel()
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
.content {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}
#tolive {
  display: flex;
  float: left;
  box-sizing: border-box;
  /deep/ div {
    margin: 5px;
    // border: 1px solid #cccccc;
    height: 150px !important;
    width: 200px !important;
    float: left;
  }
}
#live {
  width: 200px;
  height: 150px;
  float: left;
  box-sizing: border-box;
  /deep/ div {
    margin: 0 !important;
  }
}

.dialog-footer {
  text-align: center;
  img {
    cursor: pointer;
    margin: 0 20px;
  }
  .invitedButton {
    display: inline-block;
    .btn {
      display: none;
    }
    &:hover {
      .btn {
        display: inline;
      }
      .gif {
        display: none;
      }
    }
  }
}

.jc-clearboth::before,
.jc-clearboth::after {
  display: table;
  content: "";
  clear: both;
}
</style>
