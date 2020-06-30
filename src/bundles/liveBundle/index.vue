<template>
  <div>
    <el-button @click="start" type="primary">打开</el-button>
    <!-- <el-button @click="start" type="primary">开始观摩</el-button> -->
    <!-- <el-button @click="stop">结束观摩</el-button> -->
    <im-live :params.sync="params" :visible.sync="visible"></im-live>
    <!-- <div id="test"></div> -->
  </div>
</template>

<script>
import imLive from './imLive'
// import { Foreign } from '@/live/foreign'
// import Foreign from '@/live/jclive'

export default {
  name: 'liveDemo',
  components: {
    imLive
  },
  data() {
    return {
      visible: false,
      params: null
    }
  },
  mounted() {
    // this.test = new Foreign('test', '488a5c2f1f2d435ca76e609007eff1e4', '3213123', '李向玉')
  },
  methods: {
    start() {
      this.params = {
        users: [{
          userId: '56785471337922560',
          userName: '李孝贤南京'
        } ], //用户列表 id , '56783818509516800', '56783679036325888'
        // {
        //   userId: '56776731599568896',
        //   userName: 'lxx'
        // },
        inviteType: '1', //'0': '语音'   '1': '视频'   '2': '强制观摩'   '3': '观摩'
        channelId: null //可选  采集观摩需要
      }
      this.visible = true
      // this.test.start('58560229624774656')
    },
    stop() {
      this.test.stop()
    }
  }
}
</script>

<style lang="scss" scoped>
#test {
  width: 500px;
  height: 300px;
}
</style>
