<template>
  <!-- <el-dialog class="imLive" title="视频通话" :visible.sync="dialogVisible" width="840px" :close-on-click-modal="false" :append-to-body="true" :close-on-press-escape="false" :show-close="false">
  </el-dialog> -->
  <!-- v-show="dialogVisible" -->
  <div class="imLive">

    <transition-group name="fade">
      <div key="1" class="content" :class="{'full-content':contentSize==='2','full-animation':contentSize==='2','normal-animation':showNormal,observe:inviteType==='2'||inviteType==='3'}" v-show="contentShow&&contentSize!=='0'">
        <div class="title">
          <span>视频通话</span>
          <div class="right">
            <span class="exit" @click="exit" title="挂断">挂断</span>
            <span title="投屏" v-show="inviteType!='2'&&inviteType!='3'">
              <img src="./assets/bigScreen1.png" alt="" width="20">
              <img src="./assets/bigScreen2.png" alt="" width="20">
            </span>
            <span title="全屏" v-show="contentSize==='1'&&(inviteType!='2'&&inviteType!='3')" @click="changeSize('2')">
              <img src="./assets/full1.png" alt="" width="20">
              <img src="./assets/full2.png" alt="" width="20">
            </span>
            <span title="取消全屏" v-show="contentSize==='2'&&(inviteType!='2'&&inviteType!='3')" @click="changeSize('1')">
              <img src="./assets/closeFull1.png" alt="" width="20">
              <img src="./assets/closeFull2.png" alt="" width="20">
            </span>
            <span title="缩小" @click="changeSize('0')" v-show="contentSize==='1'&&(inviteType!='2'&&inviteType!='3')">
              <img src="./assets/narrow1.png" alt="" width="20">
              <img src="./assets/narrow2.png" alt="" width="20">
            </span>
          </div>
        </div>
        <div class="live-out">
          <div class="live-in">
            <div id="live" v-show="myShow" class="live" :class="{audio:inviteType==='0','big-live':bigLiveId===user.userId}" @click="checkBigLive(user.userId)">
              <div class="userName">{{user.userName}}</div>
            </div>
            <!-- <div class="live"></div> -->
            <div class="live" @click="checkBigLive(user.userId)" :class="{audio:inviteType==='0','big-live':bigLiveId===user.userId}" v-for="user in users" :key="user.userId" :id="user.userId">
              <div class="userName">{{user.userName}}</div>
            </div>
          </div>
        </div>
      </div>

      <div key="2" class="content-small" v-show="contentShow&&contentSize==='0'">
        <span class="exit" @click="exit" title="挂断">挂断</span>
        <span class="count">{{users.length+1}} 人</span>
        <span title="放大" @click="changeSize('1')">
          <img src="./assets/enlarge1.png" alt="" width="20">
          <img src="./assets/enlarge2.png" alt="" width="20">
        </span>
      </div>
    </transition-group>

    <transition name="fade">
      <div class="call-box" v-if="invitedButton">
        <span class="invitedButton">
          <img class="gif" src="./assets/help.gif" alt="" width="50">
          <img class="btn" src="./assets/answer.png" alt="" width="50" @click="agree" title="接听">
          <img class="btn" src="./assets/hangup.png" alt="" width="50" @click="refuse" title="挂断">
        </span>
        <h3 class="title">{{msg}}</h3>
      </div>
    </transition>

  </div>

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
      showNormal: false,
      bigLiveId: '',
      contentSize: '1',
      users: [],
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
      inviteType: '',
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
        this.bigLiveId = this.user.userId
        this.contentSize = '1'
        this.showNormal = false
        if (this.params) {
          const { inviteType, users, channelId } = this.params

          this.users = users
          this.inviteType = inviteType
          //设置频道id
          this.channelId = channelId ? channelId : new Date().getTime().toString()
          this.msg = '正在发起' + this.inviteTypes[inviteType][0]
          this.$message.info('正在发起' + this.inviteTypes[inviteType][0])
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
  },
  methods: {
    checkBigLive(val) {
      if (this.contentSize === '2') {
        this.bigLiveId = val
      }
    },
    changeSize(val) {
      this.bigLiveId = this.user.userId
      this.showNormal = (val === '1' && this.contentSize === '2') ? true : false
      this.contentSize = val
    },
    imMsgCb(onType, data) {
      console.log('vue 数据', onType, data)
      const { fromUsername, content: { channelId, msgType, agree, nickName, isExit, inviteType, mediaType, content, users } } = data

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
          this.users = [{
            userId: fromUsername,
            userName: nickName
          }]
          if (users) {
            console.log('邀请的所有users', users)
            users.forEach(item=>{
              if (item.userId !== this.user.userId) {
                this.users.push(item)
              }
            })
          }
          this.inviteType = mediaType
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
        this.invitUserId = item.userId
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
        mediaType, //"0":音频,"1":视频,
        users: this.users
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
      this.users = []
      this.$emit('update:visible', false)
      this.$emit('update:params', null)
      setTimeout(()=>{
        this.dialogVisible = false
      }, 600)
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
            this.im.sendSingleMsg(item.userId, msg)
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
//弹框过度样式
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.6s, opacity 0.6s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(200%);
}

//小窗口
.content-small {
  background-color: white;
  width: 200px;
  position: fixed;
  z-index: 9999;
  bottom: $jc-default-dis;
  left: 50%;
  margin-left: -100px;
  border-radius: 3px;
  box-shadow: 0 0 5px 0px #cccccc;
  padding: 10px 20px;
  display: flex;
  justify-content: space-around;
  & > span {
    cursor: pointer;
    // float: left;
    // margin-left: 10px;

    & > img:last-child {
      display: none;
    }
    &:hover > img:last-child {
      display: inline;
    }
    &:hover > img:first-child {
      display: none;
    }
  }
  .count {
    line-height: 24px;
    cursor: inherit;
  }
  .exit {
    background: red;
    color: white;
    padding: 1.5px 10px;
    border-radius: 3px;
  }
}

//视频弹框样式
.content {
  width: 840px;
  background-color: white;
  position: fixed;
  z-index: 999;
  bottom: $jc-default-dis;
  left: 50%;
  margin-left: -420px;
  border-radius: 3px;
  box-shadow: 0 0 5px 0px #cccccc;
  padding: 10px;
  .title {
    position: relative;
    padding: 5px 10px;
  }
  .title:before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto 0;
    content: "";
    display: block;
    width: 3px;
    height: 14px;
    border-radius: 2px;
    background-color: #409eff;
  }
  .right {
    float: right;
    & > span {
      cursor: pointer;
      float: left;
      margin-left: 10px;

      & > img:last-child {
        display: none;
      }
      &:hover > img:last-child {
        display: inline;
      }
      &:hover > img:first-child {
        display: none;
      }
    }
  }
  .exit {
    background: red;
    color: white;
    padding: 1.5px 10px;
    border-radius: 3px;
  }
}

//视频窗口样式
.live-out {
  overflow-x: auto;
  overflow-y: hidden;
  height: 160px;
}

.live-in {
  display: flex;
  float: left;
  box-sizing: border-box;
  .live {
    margin: 5px;
    // border: 1px solid #cccccc;
    height: 150px;
    width: 200px;
    float: left;
    position: relative;
    background: url(./assets/video.png) no-repeat;
    background-size: 100% 100%;

    .userName {
      padding: 2px 10px;
      background: rgba($color: #000000, $alpha: 0.2);
      color: white;
      width: 100%;
      position: absolute;
      z-index: 100;
    }
  }
  .audio {
    background: url(./assets/audio.png) no-repeat;
    background-size: 100% 100%;
  }
}

//放大过渡动画
.full-animation {
  animation: to-full 0.6s linear;
}
@keyframes to-full {
  0% {
    bottom: inherit;
    top: 700px;
  }
  25% {
    top: 600px;
  }
  50% {
    top: 400px;
  }
  75% {
    top: 200px;
  }
  100% {
    top: 76px;
    bottom: inherit;
  }
}
.normal-animation {
  animation: to-normal 0.6s linear;
}
@keyframes to-normal {
  0% {
    top: inherit;
    bottom: 400px;
  }
  25% {
    bottom: 300px;
  }
  50% {
    bottom: 200px;
  }
  75% {
    bottom: 100px;
  }
  100% {
    bottom: $jc-default-dis;
    top: inherit;
  }
}

//大窗口
.full-content {
  // width: 640px;
  top: 76px;
  right: 320px;
  // margin-left: 0;
  // left: inherit;
  bottom: inherit;

  .live-out {
    overflow-x: hidden;
    overflow-y: auto;
    height: 440px;

    .live-in {
      width: 210px;
      // height: 100%;
      display: block;
      float: right;

      .live {
        cursor: pointer;
        float: none;
      }

      .big-live {
        width: 600px;
        height: 440px;
        position: absolute;
        left: 5px;
        top: 39px;
      }
    }
  }
}

//观摩窗口
.observe {
  width: 630px;
  margin-left: -315px;
  top: 76px;
  bottom: inherit;
  .live-out {
    height: 440px;
  }
  .live {
    width: 600px;
    height: 440px;
  }
}

//来电弹框样式
.call-box {
  position: fixed;
  z-index: 9999;
  text-align: center;
  width: 100%;
  bottom: $jc-default-dis;
  .title {
    text-align: center;
  }
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
</style>
