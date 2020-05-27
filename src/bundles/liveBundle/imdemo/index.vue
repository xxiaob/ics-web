<template>
  <div>
    <el-button type="primary" @click="register">注册</el-button>
    <el-button type="primary" @click="login">登录</el-button>
    <el-button type="primary" @click="send">发送</el-button>
  </div>
</template>

<script>
import { IM } from '@/live/im'

export default {
  name: 'imdemo',
  created() {
    this.im = new IM()
  },
  methods: {
    register() {
      this.im.register()
    },
    login() {
      this.im.login()
    },
    send() {
      this.im.sendSingleMsg()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
