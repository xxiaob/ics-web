<template>
  <div class="jc-live-out">
    <div class="jc-live data-statistics-scrollbar">
      <div class="big-box" :class="{audio:inviteType==='0'||inviteType==='4'}"></div>
      <div class="live-in">
        <div class="live" @click="checkBigLive(user.userId)" :class="{audio:inviteType==='0'||inviteType==='4','big-live':bigLiveId===user.userId, observation:inviteType==='2'||inviteType==='3'}" v-for="user in users" :key="user.userId" :id="user.userId">
          <div class="userName">{{user.userName}}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { Live } from '@/live/agora'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'ScreenDataCenterContentScreenProjectionLive',
  props: {
    options: {
      type: Object,
      default: ()=>{}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      bigLiveId: 1,
      inviteType: '1',
      users: [
        { userName: '1', userId: 1 },
        { userName: '2', userId: 2 },
        { userName: '3', userId: 3 },
        { userName: '4', userId: 4 },
        { userName: '5', userId: 5 }
      ]
    }
  },
  watch: {
    options: {
      immediate: true,
      deep: true,
      handler(newValue) {
        console.log('newValue', newValue)
        if (newValue && newValue.channelId) {
          this.inviteType = newValue.inviteType
          this.users = newValue.users
          this.join(newValue.channelId)
          this.checkBigLive(newValue.users[0].userId)
        } else {
          this.close()
        }
      }
    }
  },
  mounted() {
    if (this.live) {
      console.log('直播客户端已经初始化')
    } else {
      this.live = new Live(this.user.userId)
    }
  },
  methods: {
    //切换小视频为大视频
    checkBigLive(val) {
      this.bigLiveId = val
    },
    //加入频道
    join(channelId) {
      this.live.joinChannel(channelId, 'audience', false, false)
    },
    //关闭投屏
    close() {
      if (this.live && this.live.joined) {
        this.live.leaveChannel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-live-out {
  height: 100%;
  position: relative;
}

.jc-live {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;

  .big-box {
    width: 73%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: url(./assets/big-video.gif) no-repeat;
    background-size: 100% 100%;
  }

  .big-box.audio {
    background: url(./assets/big-audio.gif) no-repeat;
    background-size: 100% 100%;
  }

  .live-in {
    width: 26%;
    white-space: normal;
    box-sizing: border-box;
    float: right;
    height: 100%;

    .live {
      display: block;
      margin-bottom: 10px;
      cursor: pointer;
      height: 32%;
      background: url(./assets/video.gif) no-repeat;
      background-size: 100% 100%;
      position: relative;

      .userName {
        padding: 5px 10px;
        background: rgba($color: #000000, $alpha: 0.2);
        color: white;
        width: 100%;
        position: absolute;
        bottom: 0;
        z-index: 100;
      }
    }

    .live.audio {
      background: url(./assets/audio.gif) no-repeat;
      background-size: 100% 100%;
    }

    .big-live {
      animation: big-live-to-full 0.3s linear;
      background: url(./assets/big-video.gif) no-repeat;
      background-size: 100% 100%;
      width: 73%;
      height: 100%;
      margin-bottom: 0;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 999;
    }

    .big-live.audio {
      background: url(./assets/big-audio.gif) no-repeat;
      background-size: 100% 100%;
    }

    .observation {
      width: 100%;
    }
  }
}

@keyframes big-live-to-full {
  0% {
    height: 32%;
    width: 26%;
    left: 70%;
  }

  100% {
    width: 73%;
    height: 100%;
    left: 0;
  }
}
</style>
