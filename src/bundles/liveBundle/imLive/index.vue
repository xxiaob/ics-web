<template>
  <!-- v-show="dialogVisible" -->
  <div class="imLive">

    <transition-group name="fade">
      <div key="1" class="content" :class="{'full-content':contentSize==='2','full-animation':contentSize==='2','normal-animation':showNormal,observe:inviteType==='2'||inviteType==='3'}" v-show="contentShow&&contentSize!=='0'">
        <div class="title">
          <span>{{title}}</span>
          <div class="right">
            <span class="exit" @click="exit" title="挂断">挂断</span>
            <span title="投屏" @click="sendScreen">
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
              <div class="badNetwork" v-show="badNetwork">您当前网络不好</div>
            </div>
            <div class="live" @click="checkBigLive(user.userId)" :class="{audio:inviteType==='0'||inviteType==='4','big-live':bigLiveId===user.userId}" v-for="user in users" :key="user.userId" :id="user.userId">
              <div class="userName">{{user.userName}}</div>
              <div class="badStream" v-show="badStreams.includes(user.userId)">对方网络不好</div>
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
import { MESSAGE_DATA_TYPES } from '@/constant/Dictionaries'
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
      isSendScreen: false,
      title: '视频',
      showNormal: false, //大弹框到中等弹框的过渡类
      bigLiveId: '', //大视频的id
      contentSize: '1', //弹框大小
      users: [], //通话中的用户列表(除了自己)
      userIds: [],
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
      observation: false,
      overtime: 60000,
      badNetwork: false,
      badStreams: []
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
          this.userIds = users.map(item=>item.userId)

          this.inviteType = inviteType
          //设置频道id
          console.log('大屏传进来的channelId', channelId)
          this.channelId = channelId ? channelId : new Date().getTime().toString()
          const type = this.inviteTypes[inviteType][0]

          this.msg = '正在发起' + type
          this.$message.info('正在发起' + type)
          this.title = type
          this.inviteAllUsers(...this.inviteTypes[inviteType][1], users)
          // if (this.inviteType === '4' || this.inviteType === '5') {
          // }
          this.timeout = setTimeout(()=>{
            if (this.live.rtc.remoteStreams.length === 0) {
              this.$message.info('对方未接听')
              this.confirmExit()
            }
          }, this.overtime)
        } else {
          console.log('我是接收方')
        }
      }
    }
  },
  created() {
    this.im = new IM(this.user.userId, this.user.userName)
    this.im.on(this.imMsgCb)

    //一个人进多个频道强制观摩
    this.$EventBus.$on('notice-compulsory-observation', ({ type, userId })=>{
      console.log('notice-compulsory-observation', userId)
      if (type === 'start') {
        this.startObservation(userId)
      } else if (type === 'stop') {
        this.stopObservation(userId)
      }
    })
  },
  mounted() {
    if (this.live) {
      console.log('直播客户端已经初始化')
    } else {
      this.live = new Live(this.user.userId, 'live', 'tolive', this.liveNetworkCb, this.liveStreamCb)
    }
  },
  methods: {
    //一个人进多个频道强制观摩-------------------------------------------
    startObservation(userId) {
      console.log(this['live' + userId])
      if (!this['live' + userId]) {
        console.log('创建直播客户端', userId)

        this['live' + userId] = new Live(this.user.userId)
        const channelId = userId + 'observation'

        setTimeout(()=>{
          this['live' + userId].joinChannel(channelId, 'audience', true, false, userId)
        })

        this.im.sendSingleMsg(userId, {
          content: '',
          msgType: '1',
          nickName: this.user.userName,
          channelId,
          inviteDevice: '2', //"0":pc端, "1":移动端, "2":执法仪 , "3":全部
          inviteType: '2', //"0":正常,"1":强拉 2":强制观摩(拉执法仪)
          mediaType: '1' //"0":音频,"1":视频,
        })
      } else {
        console.log('直播客户端已创建', userId)
      }
    },
    stopObservation(userId) {
      const channelId = userId + 'observation'

      this.im.sendSingleMsg(userId, {
        msgType: '1',
        channelId,
        nickName: this.user.userName,
        isExit: '1'
      })
      this.leaveObservation(userId)
    },
    async leaveObservation(userId) {
      if (this['live' + userId].joined) {
        await this['live' + userId].leaveChannel()
        this['live' + userId] = null
      }
    },
    //一个人进多个频道强制观摩-------------------------------------------

    //当前网络监听
    liveNetworkCb(v) {
      console.log('liveCb', v)
      this.badNetwork = v
    },
    liveStreamCb(v) {
      console.log('liveStreamCb', v)
      this.badStreams = v
    },
    //投屏
    sendScreen() {
      const { inviteType, users } = this.params
      const { userName, userId } = this.user
      const copyUsers = JSON.parse(JSON.stringify(users))

      if (inviteType != '2' && inviteType != '3') {
        copyUsers.unshift({ userId, userName })
      }
      const data = {
        channelId: this.channelId,
        inviteType,
        users: copyUsers
      }

      // console.log('sendScreen', data)
      this.isSendScreen = true
      this.$EventBus.$emit('screen-message-channel', { type: MESSAGE_DATA_TYPES.LIVE, data })
      this.$message.success('投屏发送成功')
    },
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
      if (this.contentSize === '2') {
        setTimeout(()=>{
          this.bigLiveId = this.user.userId
        }, 200)
      }
    },
    //im 实时数据回调
    imMsgCb(onType, data) {
      console.log('vue 数据', onType, data)
      const { fromUsername, content: { channelId, msgType, inviteDevice, agree, nickName, isExit, inviteType, mediaType, content, users } } = data

      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      if (msgType === '1' && (inviteDevice != '1' && inviteDevice != '2')) {
        console.log('邀请视频')
        if (isExit) {
          //退出消息
          if (this.fromUsername == fromUsername || this.userIds.includes(fromUsername)) {
            this.exitHandel({ nickName, isExit })
          }
          if (channelId.indexOf('observation') > -1) {
            console.log('一进多 对方退出', fromUsername)
            this.$EventBus.$emit('notice-compulsory-observation-leave', { type: 'leave', userId: fromUsername })
            this.leaveObservation(fromUsername)
          }
        } else if ( agree) {
          //邀请消息 我是邀请方
          this.inviteHandelMsg( agree, nickName)
        } else if (inviteType) {
          //我是被邀请方
          this.fromUsername = fromUsername
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

          if (this.live.joined) {
            console.log('正则频道里')
            this.users.forEach(item=>{
              this.im.sendSingleMsg(item.userId, {
                msgType: '1',
                nickName: this.user.userName,
                channelId: this.channelId,
                agree: '3'
              })
            })
          } else {
            this.$emit('update:visible', true)
            this.$emit('update:params', null)

            if (content === 'double' || content === 'help') {
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
              }, this.overtime)
            }
            this.invitedHandelMsg({ channelId, mediaType, inviteType })
          }
        }
      } else {
        console.log('普通消息')
      }
    },
    exitHandel({ nickName, isExit }) {
      this.$EventBus.$emit('map-voice-end') //通知停止播放提示音
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
      if (agree === '3') {
        this.$message.warning(nickName + '正在忙')

        if (this.inviteType === '4' || this.inviteType === '5' || this.inviteType === '3' || this.inviteType === '2') {
          setTimeout(()=>{
            this.leaveChannel()
          }, 2000)
        }

        return
      }

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
      this.users.forEach(item=>{
        this.im.sendSingleMsg(item.userId, {
          msgType: '1',
          channelId: this.channelId,
          nickName: this.user.userName,
          agree: '1' // "0":拒绝邀请, "1":接受邀请,
        })
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

      let inviteDevice = '3'

      if (this.inviteType === '2') {
        inviteDevice = '2'
      }
      const msg = {
        content,
        msgType: '1',
        nickName: this.user.userName,
        channelId: this.channelId,
        inviteDevice, //"0":pc端, "1":移动端, "2":执法仪 , "3":全部
        inviteType, //"0":正常,"1":强拉 2":强制观摩(拉执法仪)
        mediaType, //"0":音频,"1":视频,
        users: this.users
      }

      this.im.sendSingleMsg(this.invitUserId, msg)
    },
    //离开频道
    async leaveChannel() {
      if (this.isSendScreen) {
        this.$EventBus.$emit('screen-message-channel', { type: MESSAGE_DATA_TYPES.CLOSR, closeType: MESSAGE_DATA_TYPES.LIVE })
        this.isSendScreen = false
      }
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
