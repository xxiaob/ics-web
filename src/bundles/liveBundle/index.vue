<template>
  <div>
    <!-- <el-button @click="start" type="primary">打开</el-button> -->
    <el-button @click="start('56783818509516800')" type="primary">开始观摩1</el-button>
    <el-button @click="stop('56783818509516800')">结束观摩1</el-button>
    <el-button @click="start('56785471337922560')" type="primary">开始观摩2</el-button>
    <el-button @click="stop('56785471337922560')">结束观摩2</el-button>
    <im-live></im-live>
    <!-- <div id="test"></div> -->
    <div class="test" id="56783818509516800"></div>
    <div class="test" id="56785471337922560"></div>
  </div>
</template>

<script>
import imLive from './imLive'
// import { Foreign } from '@/live/foreign'

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
    // this.test = new Foreign('test', 'e8cf78c8bd6b49bcb60e65c1fc33973c', '3213123', '李向玉')
    this.$EventBus.$on('notice-compulsory-observation-leave', ({ type, userId })=>{
      console.log('notice-compulsory-observation-leave', type, userId)
    })
  },
  methods: {
    start(userId) {
      // this.params = {
      //   users: [{
      //     userId: '56776731599568896',
      //     userName: '李孝贤'
      //   } ], //用户列表 id , '56783818509516800', '56783679036325888'
      //   // {
      //   //   userId: '56776731599568896',
      //   //   userName: 'lxx'
      //   // },
      //   //'0': '多人语音'   '1': '多人视频'   '2': '强制观摩'   '3': '观摩'  '4': '双人语音'  '5': '双人视频'
      //   inviteType: '1',
      //   channelId: null //可选  采集观摩需要
      // }
      // this.visible = true
      // this.test.start('68707744802144256')
      console.log(userId)
      this.$EventBus.$emit('notice-compulsory-observation', { type: 'start', userId })
    },
    stop(userId) {
      console.log(userId)
      this.$EventBus.$emit('notice-compulsory-observation', { type: 'stop', userId })

      // this.test.stop()
    }
  }
}
</script>

<style lang="scss" scoped>
#test,
.test {
  width: 500px;
  height: 300px;
  border: 1px solid red;
}
</style>
