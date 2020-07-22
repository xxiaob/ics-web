<template>
  <div class="jc-live-out">
    <div class="jc-live">
      <div class="big-box"></div>
      <div class="live-in">
        <div class="live" @click="checkBigLive(user.userId)" :class="{audio:inviteType==='0'||inviteType==='4','big-live':bigLiveId===user.userId}" v-for="user in users" :key="user.userId" :id="user.userId">
          <div class="userName">{{user.userName}}</div>
        </div>
        <div class="live big-live">1</div>
        <div class="live">2</div>
        <div class="live">3</div>
        <div class="live">4</div>
        <div class="live">4</div>
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
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      users: []
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
      if (this.live.joined) {
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
    width: 68%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .live-in {
    width: 30%;
    white-space: normal;
    box-sizing: border-box;
    float: right;
    height: 100%;
    .live {
      display: block;
      margin-bottom: 10px;
      cursor: pointer;
      height: 30%;

      background-color: aqua;
    }

    .big-live {
      animation: big-live-to-full 0.3s linear;

      width: 68%;
      height: 100%;
      margin-bottom: 0;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 999;
    }
  }
}

@keyframes big-live-to-full {
  0% {
    height: 150px;
    width: 200px;
    left: 600px;
  }

  100% {
    width: 600px;
    height: 440px;
    left: 5px;
  }
}
</style>
