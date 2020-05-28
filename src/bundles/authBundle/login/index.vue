<template>
  <div class="jc-login-warp">
    <img src="./assets/login-bg.png" class="jc-login-bg" />
    <div class="jc-login-header"></div>
    <div class="jc-login-space">
      <div class="jc-login-title">欢迎登录</div>
      <div class="jc-input-warp">
        <input class="jc-login-input" type="text" v-model="form.userName" placeholder="请输入账号" maxlength="20" @keyup.enter="onSubmit" />
      </div>
      <div class="jc-input-warp">
        <input class="jc-login-input" type="password" v-model="form.password" placeholder="请输入密码" maxlength="20" @keyup.enter="onSubmit" />
      </div>
      <div class="jc-tip" v-text="tip"></div>
      <div class="jc-login-btn" @click="onSubmit">
        <JcSpinner v-if="loading"></JcSpinner>
        <span v-else>登 录</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { login } from '@/api/auth'
export default {
  name: 'Login',
  components: {
    JcSpinner: () => import('./modules/spinner')
  },
  data() {
    return {
      loading: false,
      tip: '',
      form: {
        userName: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.tip = ''
      if (this.form.userName && this.form.password) {
        if (!this.loading) {
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
      } else {
        this.tip = '账号密码不能为空'
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
  overflow: hidden;
}
.jc-login-bg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.jc-login-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 110px;
  z-index: 9;
  background: url(./assets/login-logo.png) no-repeat;
  background-position: 60px center;
  border-bottom: solid 1px #253270;
}
.jc-login-space {
  position: absolute;
  top: 0;
  left: 60%;
  bottom: 0;
  right: 0;
  margin: auto 0 auto 0;
  width: 560px;
  height: 500px;
  background: url(./assets/login-warp.png) no-repeat center;
  background-size: 100% 100%;
  padding: 60px 92px 84px 108px;
}
.jc-login-title {
  text-align: center;
  height: 110px;
  line-height: 110px;
  font-size: 34px;
  letter-spacing: 5px;
  color: $jc-color-white;
}

.jc-input-warp {
  position: relative;
  height: 40px;
  padding: 0 20px;
  background-color: #0e6aae;
  box-shadow: 0 0 2px #5bd0e8;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 24px;
  transform: all 0.3s;
  &:hover,
  &:focus {
    box-shadow: 0 0 3px #5bd0e8;
  }
  .jc-login-input {
    height: 40px;
    line-height: 40px;
    width: 100%;
    background-color: transparent;
    border: none;
    outline: none;
    box-shadow: 0 0 0 1000px #0e6aae inset !important;
    color: $jc-color-white;

    &::-webkit-input-placeholder {
      color: rgba($color: $jc-color-white, $alpha: 0.8);
    }
    &:-webkit-autofill {
      color: $jc-color-white !important;
      -webkit-background-clip: text;
      -webkit-text-fill-color: $jc-color-white !important;
    }
  }
}

.jc-tip {
  height: 24px;
  line-height: 20px;
  color: $jc-color-danger;
}
.jc-login-btn {
  position: relative;
  width: 100%;
  background-color: #46b0e2;
  color: $jc-color-white;
  text-align: center;
  font-size: 18px;
  height: 40px;
  line-height: 40px;
  margin-top: 10px;
  cursor: pointer;
  opacity: 0.8;
  border-radius: 20px;
  &:hover {
    opacity: 1;
  }
}
</style>
