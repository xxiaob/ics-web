<template>
  <div class="jc-login-warp">
    <img :src="systemBg" class="jc-login-bg" />
    <div class="jc-login-header" :style="systemLogo"></div>
    <div class="jc-login-space" :style="loginBg" :class="loginPosition">
      <div class="jc-logon-content">
        <div class="jc-login-title">欢迎登录</div>
        <div class="jc-input-warp">
          <input class="jc-login-input" type="text" v-model="form.userName" placeholder="请输入账号" maxlength="20" @keyup.enter="onSubmit" />
        </div>
        <div class="jc-input-warp jc-last-child">
          <input class="jc-login-input" type="password" v-model="form.password" placeholder="请输入密码" maxlength="20" @keyup.enter="onSubmit" />
        </div>
        <div class="jc-tip" v-text="tip"></div>
        <div class="jc-login-btn" @click="onSubmit">
          <JcSpinner v-if="loading"></JcSpinner>
          <span v-else>登 录</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { login } from '@/api/auth'
import md5 from 'md5'
import { getDomainLogoConfig, setDomainLogoConfig } from '@/libs/storage'
import { listAll } from '@/api/domainLogo'
import { LOGIN_WINDOWS_POSITION } from '@/constant/Dictionaries'

export default {
  name: 'Login',
  components: {
    JcSpinner: () => import('./modules/spinner')
  },
  data() {
    return {
      loading: false,
      tip: '',
      config: {}, //登录页配置信息
      form: { userName: '', password: '' }
    }
  },
  computed: {
    systemLogo() {
      return this.config.domainLogo ? `background-image: url(${this.config.domainLogo});` : ''
    },
    systemBg() {
      return this.config.firstPageLogo ? this.config.firstPageLogo : require('./assets/login-bg.png')
    },
    loginBg() {
      return this.config.firstPageLoginLogo ? `background-image: url(${this.config.firstPageLoginLogo});` : ''
    },
    loginPosition() {
      if (this.config.loginLogoLocation == LOGIN_WINDOWS_POSITION.LEFT) {
        return 'jc-left'
      } else if (this.config.loginLogoLocation == LOGIN_WINDOWS_POSITION.CENTER) {
        return 'jc-center'
      }
      return ''
    }
  },
  created() {
    this.initData() //初始化内容
  },
  methods: {
    async initData() {
      let configs = getDomainLogoConfig()

      this.calcConfig(configs)
      try {
        configs = await listAll()
        this.calcConfig(configs)
        setDomainLogoConfig(configs)
      } catch (error) {
        console.log(error)
      }
    },
    calcConfig(configs) {
      console.log('登录系统配置', configs)
      //根据配置设置系统logo
      if (configs && configs.length) {
        let host = window.location.host

        let config = configs.find(item => item.domain == host)

        this.config = config ? config : {}
      } else {
        this.config = {}
      }
    },
    onSubmit() {
      this.tip = ''
      if (this.form.userName && this.form.password) {
        if (!this.loading) {
          this.loading = true
          login({ userName: this.form.userName, password: md5(this.form.password) }).then((res) => {
            this.setUser(res)
            let goUrl = { name: res.userRespInnerDTO && res.userRespInnerDTO.entranceRouter ? res.userRespInnerDTO.entranceRouter : 'index' }

            if (this.$route.query.callbackUrl && !this.$route.query.callbackUrl.includes('login')) {
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
    ...mapMutations('user', ['setUser'])
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
  background-image: url(/static/images/login-logo.png);
  background-repeat: no-repeat;
  background-position: 60px center;
}
.jc-login-space {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 60px;
  margin: auto 0 auto 0;
  width: 420px;
  height: 400px;
  background: url(./assets/login-warp.png) no-repeat center;
  background-size: 100% 100%;
  &.jc-center {
    left: 0;
    right: 0;
    margin: auto;
  }
  &.jc-left {
    left: 60px;
    right: auto;
  }
}
.jc-logon-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 280px;
  height: 300px;
}
.jc-login-title {
  text-align: center;
  height: 80px;
  line-height: 60px;
  font-size: 22px;
  letter-spacing: 5px;
  color: $jc-color-white;
}

.jc-input-warp {
  position: relative;
  height: 40px;
  padding: 0 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 26px;
  &.jc-last-child {
    margin-bottom: 12px;
  }
  .jc-login-input {
    height: 40px;
    line-height: 40px;
    width: 100%;
    background-color: transparent;
    border: none;
    outline: none;
    text-align: center;
    font-size: $jc-font-size-medium;
    box-shadow: 0 0 0 1000px transparent inset !important;
    color: $jc-color-white;
    letter-spacing: 1px;

    &::-webkit-input-placeholder {
      color: rgba($color: $jc-color-white, $alpha: 0.2);
      font-size: $jc-font-size-medium;
      letter-spacing: 1px;
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
  text-align: center;
  color: $jc-color-danger;
  font-size: $jc-font-size-smaller;
}
.jc-login-btn {
  position: relative;
  width: 100%;
  background-color: #0096ff;
  color: $jc-color-white;
  text-align: center;
  font-size: 18px;
  height: 40px;
  line-height: 40px;
  margin-top: 10px;
  cursor: pointer;
  opacity: 1;
  border-radius: 20px;
  &:hover {
    opacity: 0.8;
  }
}
</style>
