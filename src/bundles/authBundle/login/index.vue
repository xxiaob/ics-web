<template>
  <div class="jc-login-warp">
    <div class="jc-login-space">
      <div class="jc-login-title">行政执法指挥系统</div>
      <div class="jc-input-warp">
        <el-form ref="form" :model="form" :hide-required-asterisk="true" label-width="0">
          <el-form-item prop="userName" :rules="rules.Len20">
            <el-input v-model="form.userName" type="text" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password" :rules="rules.Len20">
            <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="onSubmit" :loading="loading" class="jc-login-btn">登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { getStringRule } from '@/libs/rules'
import { login } from '@/api/auth'
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      form: {
        userName: '',
        password: ''
      },
      rules: {
        Len20: getStringRule(1, 20)
      }
    }
  },
  methods: {
    onSubmit() {
      if (!this.loading) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true
            login(this.form).then((res) => {
              this.setUser(res)
              let goUrl = '/'

              if (this.$route.query.callbackUrl && this.$route.query.callbackUrl.indexOf('login') < 0) {
                goUrl = this.$route.query.callbackUrl
              }
              this.$router.push(goUrl)
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    },
    ...mapMutations('user', [
      'setUser'
    ])
  }
}
</script>
<style lang="scss" scoped>
.jc-login-warp {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: url(./assets/login-bg.png) no-repeat center;
}
.jc-login-space {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 500px;
  height: 300px;
  background-color: $jc-color-white;
  border-radius: $jc-border-radius-base;
}
.jc-login-title {
  text-align: center;
  height: 50px;
  line-height: 50px;
  font-size: $jc-font-size-larger;
  border-bottom: solid 1px $jc-color-line-primary;
}
.jc-input-warp {
  padding: 30px 50px;
}

.jc-login-btn {
  width: 100%;
  height: 45px;
  margin-top: 20px;
}
</style>
