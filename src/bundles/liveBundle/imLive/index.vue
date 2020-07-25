<template>
  <!-- v-show="dialogVisible" -->
  <div class="imLive">

    <transition-group name="fade">
      <div key="1" class="content" :class="{'full-content':contentSize==='2','full-animation':contentSize==='2','normal-animation':showNormal,observe:inviteType==='2'||inviteType==='3'}" v-show="contentShow&&contentSize!=='0'">
        <div class="title">
          <span>{{title}}</span>
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
          <div class="big-box"></div>
          <div class="live-in">
            <div id="live" v-show="myShow" class="live" :class="{audio:inviteType==='0'||inviteType==='4','big-live':bigLiveId===user.userId}" @click="checkBigLive(user.userId)">
              <div class="userName">{{user.userName}}</div>
            </div>
            <div class="live" @click="checkBigLive(user.userId)" :class="{audio:inviteType==='0'||inviteType==='4','big-live':bigLiveId===user.userId}" v-for="user in users" :key="user.userId" :id="user.userId">
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
          <img class="btn" src="./assets/hangup.png" alt="" width="50" @click="refuse('0')" title="挂断">
        </span>
        <h3 class="title">{{msg}}</h3>
      </div>
    </transition>

  </div>

</template>

<script>
import { IM } from '@/live/im'
import { Live } from '@/live/agora'
import { VOICE_TYPE } from '@/config/JcVoiceAlertConfig'
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
      title: '视频',
      showNormal: false, //大弹框到中等弹框的过渡类
      bigLiveId: '', //大视频的id
      contentSize: '1', //弹框大小
      users: [], //通话中的用户列表(除了自己)
      msg: '音视频通话',
      dialogVisible: false,
      contentShow: false,
      myShow: false,
      channelId: '',
      invited: false, //我是邀请方
      //邀请类型
      inviteTypes: {
        '0': ['音频会议', ['0', '0', 'host']],
        '1': ['视频会议', ['0', '1', 'host']],
        '2': ['强制观摩', ['2', '1', 'audience']],
        '3': ['观摩', ['0', '1', 'audience']],
        '4': ['对讲', ['0', '0', 'host']], //双人语音
        '5': ['指挥', ['0', '1', 'host']] //双人视频
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
    //通过监听visible来发起音视频
    visible(newVal) {
      if (newVal) {
        this.dialogVisible = newVal
        this.bigLiveId = ''
        this.contentSize = '1'
        this.showNormal = false
        if (this.params) {
          const { inviteType, users, channelId } = this.params

          this.users = users
          this.inviteType = inviteType
          //设置频道id
          console.log('大屏传进来的channelId', channelId)
          this.channelId = channelId ? channelId : new Date().getTime().toString()
          const type = this.inviteTypes[inviteType][0]

          this.msg = '正在发起' + type
          this.$message.info('正在发起' + type)
          this.title = type
          this.inviteAllUsers(...this.inviteTypes[inviteType][1], users)
          if (this.inviteType === '4' || this.inviteType === '5') {
            this.timeout = setTimeout(()=>{
              this.$message.info('对方未接听')
              this.confirmExit()
            }, 30000)
          }
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
    //切换小视频为大视频
    checkBigLive(val) {
      if (this.contentSize === '2') {
        this.bigLiveId = val
      }
    },
    //改变弹框大小
    changeSize(val) {
      this.bigLiveId = ''
      this.showNormal = (val === '1' && this.contentSize === '2') ? true : false
      this.contentSize = val
    },
    //im 实时数据回调
    imMsgCb(onType, data) {
      console.log('vue 数据', onType, data)
      const { fromUsername, content: { channelId, msgType, agree, nickName, isExit, inviteType, mediaType, content, users } } = data

      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.fromUsername = fromUsername
      if (msgType === '1') {
        console.log('邀请视频')
        if (isExit) {
          //退出消息
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
          if (content === 'double') {
            this.inviteType = mediaType === '0' ? '4' : '5'
          } else {
            this.inviteType = mediaType
          }
          this.title = mediaType === '0' ? '语音' : '视频'
          if (inviteType === '0') {
            let msg = content === 'help' ? '寻求求助' : (mediaType === '0' ? '语音' : '视频')

            this.msg = nickName + '邀请你' + msg

            const type = content === 'help' ? VOICE_TYPE.HELP_REMIND : (mediaType === '0' ? VOICE_TYPE.AUDIO_REMIND : VOICE_TYPE.VIDEO_REMIND)

            // console.log('type', type)
            this.$EventBus.$emit('map-voice-alert', { type, loop: true }) //通知播放提示音
            this.timeout = setTimeout(()=>{
              this.refuse('2')
            }, 30000)
          }
          this.invitedHandelMsg({ channelId, mediaType, inviteType })
        }
      } else {
        console.log('普通消息')
      }
    },
    exitHandel({ nickName, isExit }) {
      if (this.live.joined) {
        this.$message.warning(nickName + '退出')
        console.log('isExit - rtc.remoteStreams', this.live.rtc.remoteStreams)
        if (this.live.rtc.remoteStreams.length === 0) {
          this.leaveChannel()
        }
      }
      if (isExit === '1' || (this.inviteType === '4' || this.inviteType === '5')) {
        console.log('结束视频')
        this.leaveChannel()
      }
    },
    //邀请方处理回来的信息
    inviteHandelMsg( agree, nickName) {
      if (this.live.joined) {
        if (agree === '1') {
          this.$message.success(nickName + '同意接听')
        } else {
          this.$message.warning(nickName + '拒绝接听')
          if (this.inviteType === '4' || this.inviteType === '5' || this.inviteType === '3') {
            this.leaveChannel()
          }
        }
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
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.$EventBus.$emit('map-voice-end') //通知停止播放提示音
      this.joinChannel()
      this.invitedButton = false
      this.msg = ''
    },
    //拒绝加入频道
    refuse(agree = '0') {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.$EventBus.$emit('map-voice-end') //通知停止播放提示音
      this.im.sendSingleMsg(this.fromUsername, {
        msgType: '1',
        nickName: this.user.userName,
        channelId: this.channelId,
        agree // "0":拒绝邀请, "1":接受邀请
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
      const contents = {
        '0': 'meet',
        '1': 'meet',
        '2': '',
        '3': 'observation',
        '4': 'double',
        '5': 'double'
      }

      const content = contents[this.inviteType] || ''
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
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      if (this.live.joined) {
        await this.live.leaveChannel()
      }
      this.msg = ''
      this.invited = false
      this.invitedButton = false
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
      this.$confirm('确认退出', '提示', { type: 'warning' }).then( () => {
        this.confirmExit()
      }).catch(() => {})
    },
    confirmExit() {
      const isExit = (this.invited || this.inviteType === '4' || this.inviteType === '5') ? '1' : '0'
      const msg = {
        msgType: '1',
        channelId: this.channelId,
        nickName: this.user.userName,
        isExit
      }

      if (this.invited) {
        // console.log('rtc.remoteStreams', this.live.rtc.remoteStreams)
        // this.live.rtc.remoteStreams.forEach(item=>{
        //   this.im.sendSingleMsg(item.split('_')[0], msg)
        // })
        this.params.users.forEach(item=>{
          this.im.sendSingleMsg(item.userId, msg)
        })
      } else {
        this.im.sendSingleMsg(this.fromUsername, msg)
      }
      this.leaveChannel()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./css/index.scss";
</style>
