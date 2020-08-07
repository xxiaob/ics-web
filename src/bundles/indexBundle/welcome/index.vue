<template>
  <div class="jc-welcome-warp">
    <img src="./assets/bg.png" class="jc-welcome-bg" />
    <div class="jc-marquee" v-if="marqueeText">
      <div class="jc-marquee-item jc-marquee-first" v-text="marqueeText"></div>
      <div class="jc-marquee-item jc-marquee-second" v-text="marqueeText"></div>
    </div>
    <div class="jc-welcome-content" :style="welcomeLogo">
      <div class="jc-welcome-item" v-for="item in list" :key="item.id" :style="item.logo" @click="goLink(item)"></div>
      <template v-if="list.length < 1">
        <router-link :to="{name: 'main'}" tag="div" class="jc-welcome-item jc-icon1"></router-link>
        <div class="jc-welcome-item jc-icon2"></div>
        <div class="jc-welcome-item jc-icon3"></div>
        <div class="jc-welcome-item jc-icon4"></div>
        <div class="jc-welcome-item jc-icon5"></div>
      </template>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getByOrgId } from '@/api/systemIndex'
import { getDomainLogoConfig } from '@/libs/storage'

export default {
  name: 'IndexWelcome',
  data() {
    return {
      list: [],
      marqueeText: ''
    }
  },
  computed: {
    ...mapState('user', {
      user: state => state.user
    }),
    welcomeLogo() {
      return this.user && this.user.userRespInnerDTO && this.user.userRespInnerDTO.welcomeLogo ? `background-image: url(${this.user.userRespInnerDTO.welcomeLogo});` : ''
    }
  },
  created() {
    this.initData() //初始化内容
    this.getConfig() //获取配置
  },
  methods: {
    async initData() {
      try {
        let res = await getByOrgId()

        let list = []

        if (res && res.length) {
          res.forEach(item => {
            list.push({ id: item.id, logo: `background-image: url(${item.logo});`, url: item.url, newWindow: item.newWindow })
          })
        }
        this.list = list
      } catch (error) {
        console.log(error)
      }
    },
    goLink(item) {
      //处理点击跳转
      if (item.url) {
        let linkUrl = item.url

        if (item.url.indexOf('://') < 0) {
          const { href } = this.$router.resolve({ name: item.url })

          linkUrl = href
        }
        if (item.newWindow == 1) {
          //新页面打开
          window.open(linkUrl, '_blank')
        } else {
          window.location.href = linkUrl
        }
      }
    },
    getConfig() {
      let configs = getDomainLogoConfig()

      if (configs && configs.length) {
        let host = window.location.host

        let config = configs.find(item => item.domain == host)

        if (config) {
          //如果设置存在，则开启文字滚动
          this.marqueeText = ( config.enableRollingMessage == 1 && config.rollingMessage) ? config.rollingMessage : ''
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@keyframes jc-marquee-animation {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-100%);
  }
}
.jc-marquee {
  position: absolute;
  top: 0;
  left: 50%;
  height: 50px;
  line-height: 50px;
  width: 1000px;
  transform: translateX(-50%);
  font-size: $jc-font-size-large;
  color: $jc-color-white;
  overflow: hidden;
  .jc-marquee-item {
    text-align: center;
    display: block;
    white-space: nowrap;
    position: absolute;
    min-width: 100%;
    transform: translateX(100%);
    &.jc-marquee-first {
      animation: jc-marquee-animation 20s linear infinite;
    }
    &.jc-marquee-second {
      animation: jc-marquee-animation 20s linear infinite 10s;
    }
  }
}
.jc-welcome-warp {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.jc-welcome-bg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.jc-welcome-content {
  position: absolute;
  top: 80px;
  left: 80px;
  right: 80px;
  max-width: 1600px;
  margin: 0 auto;
  bottom: 60px;
  padding: 120px 0 0 0;
  display: flex;
  background: url(/static/images/index-logo.png) no-repeat top center;
  background-size: auto 66px;
}
.jc-welcome-item {
  position: relative;
  width: 0;
  height: 100%;
  flex: 1;
  cursor: pointer;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 70% auto;
  &.jc-icon1 {
    background-image: url(./assets/icon1.png);
  }
  &.jc-icon2 {
    background-image: url(./assets/icon2.png);
  }
  &.jc-icon3 {
    background-image: url(./assets/icon3.png);
  }
  &.jc-icon4 {
    background-image: url(./assets/icon4.png);
  }
  &.jc-icon5 {
    background-image: url(./assets/icon5.png);
  }
  &:hover:before {
    content: "";
    position: absolute;
    height: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(./assets/chose.png) no-repeat center;
    background-size: 100% auto;
  }
}
</style>
