<template>
  <div>
    <h1>imLive 直播demo</h1>
    <el-input v-model="channelId" placeholder="房间号"></el-input>
    <div>
      <el-button type="primary" @click="joinChannel" v-if="!inChannel">进入房间</el-button>
      <div v-if="inChannel">
        <el-button @click="exit('1')" v-if="invited">结束聊天</el-button>
        <el-button @click="exit('0')" v-else>退出房间</el-button>
      </div>
      <el-input v-model="invitUserId" placeholder="邀请用户"></el-input>
      <el-button type="primary" @click="inviteUser">邀请用户</el-button>
      <!-- <el-button type="primary" @click="pushs">推流</el-button> -->
    </div>
    <div v-if="invitedButton">
      <el-button type="primary" @click="agree">接受</el-button>
      <el-button @click="refuse">拒绝</el-button>
    </div>
    <!-- <el-input v-model="username" placeholder="用户名 4-128"></el-input>
    <el-button type="primary" @click="register">注册</el-button>
    <el-input v-model="username" placeholder="用户名 4-128"></el-input>
    <el-button type="primary" @click="login">登录</el-button> -->
    <div class="jc-clearboth">
      <div id="live"></div>
      <div id="tolive"></div>
    </div>
    <hr>
    <div>播放器</div>
    <div>
      <el-button type="primary" @click="startPlay">播放多个</el-button>
    </div>
    <video v-for="(item,index) in playUrls" :key="item" :id="'test'+index" class="video-js vjs-default-skin vjs-big-play-centered"></video>
  </div>
</template>

<script>
import { IM } from '@/live/im'
import { Live } from '@/live/agora'
import { getImAuth } from '@/api/live'
import { getUser } from '@/libs/storage'

export default {
  name: 'liveDemo',
  data() {
    return {
      username: 'lxy2',
      nickname: '李向玉',
      channelId: '123456',
      invited: false,
      invitUserId: '',
      invitedButton: false,
      mediaType: '1',
      fromUsername: '',
      inChannel: false,
      playUrls: ['https://2021-cn-north-4.cdn-vod.huaweicloud.com/asset/881736f5417582b23993c5323c185ced/292e546ae80f6cd1c7dc010be5d14449.m3u8', 'https://2021-cn-north-4.cdn-vod.huaweicloud.com/asset/49d732a4a95b3794cbb73cab3bf35cc1/6c88e090bc09c70189a456385ad78dff.m3u8', 'http://play.bg365.top/live/lxyada.m3u8']
    }
  },
  async created() {
    console.log(getUser())
    const res = await getImAuth()

    this.im = new IM(this.username, this.nickname)
    this.im.init(res)
    this.im.on(this.imMsgCb)
  },
  mounted() {
    this.live = new Live('live', 'tolive')
  },
  methods: {
    startPlay() {
      hwplayerloaded(()=>{
        this.playUrls.forEach((item, key)=>{
          const player = new HWPlayer('test' + key, {
            autoplay: true,
            controls: true,
            width: 320,
            height: 240
          }, ()=> {
            console.log('播放器已经准备好了', item)
            player.src(item)
          })
        })
      })
    },
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
    register() {
      this.im.register(this.username, this.nickname)
    },
    login() {
      this.im.login(this.username, this.nickname)
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
    //推流
    pushs() {
      this.live.publishStreamUrl('lxyad')
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
