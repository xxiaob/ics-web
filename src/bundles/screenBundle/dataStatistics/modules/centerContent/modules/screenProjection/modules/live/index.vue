<template>
  <div class="jc-live">
    <div class="big-box"></div>
    <div class="live-in">
      <div class="live" @click="checkBigLive(user.userId)" :class="{audio:inviteType==='0'||inviteType==='4','big-live':bigLiveId===user.userId}" v-for="user in users" :key="user.userId" :id="user.userId">
        <div class="userName">{{user.userName}}</div>
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
  mounted() {
    if (this.live) {
      console.log('直播客户端已经初始化')
    } else {
      this.live = new Live(this.user.userId)
    }
  },
  methods: {
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
.jc-live {
  height: 100%;
}
</style>
