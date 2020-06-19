<template>
  <div>
    <el-input v-model="username" placeholder="用户名 4-128"></el-input>
    <el-button type="primary" @click="register">注册</el-button>
    <el-input v-model="username" placeholder="用户名 4-128"></el-input>
    <el-button type="primary" @click="login">登录</el-button>
    <el-button type="primary" @click="send">发送</el-button>
  </div>
</template>

<script>
import { IM } from '@/live/im'

export default {
  data() {
    return {
      username: 'lxy2'
    }
  },
  name: 'imdemo',
  created() {
    this.im = new IM(this.username, this.msgCb)
  },
  methods: {
    msgCb(data) {
      console.log('vue 数据', data)
    },
    register() {
      this.im.register(this.username)
    },
    login() {
      this.im.login(this.username)
    },
    send() {
      this.im.sendSingleMsg()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
