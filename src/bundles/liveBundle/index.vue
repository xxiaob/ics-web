<template>
  <div>
    <el-button @click="visible=true" type="primary">打开</el-button>
    <im-live :params.sync="params" :visible.sync="visible"></im-live>
  </div>
</template>

<script>
import imLive from './imLive'
export default {
  name: 'liveDemo',
  components: {
    imLive
  },
  data() {
    return {
      visible: false,
      params: {
        users: [1, 2, 3], //用户列表 id
        inviteType: '2', //'0': '语音'   '1': '视频'   '2': '强制观摩'   '3': '观摩'
        channelId: null //可选  采集观摩需要
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
