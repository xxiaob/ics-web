<template>
  <div class="jc-welcome-warp">
    <img src="./assets/bg.png" class="jc-welcome-bg" />
    <div class="jc-marquee" v-if="marquees.length">
      <div class="jc-marquee-item" :style="{'animation-duration': marquees.length * 10 + 10 + 's' }">
        <span class="jc-marquee-text" v-for="(marqueeText,index) in marquees" :key="index" v-text="marqueeText"></span>
      </div>
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
import { getEnabledRollingMessage } from '@/api/baseConfig'

export default {
  name: 'IndexWelcome',
  data() {
    return {
      list: [],
      marquees: []
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
    async getConfig() {
      try {
        this.marquees = await getEnabledRollingMessage() || []
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$jc-marquee-width: 1000px;
@keyframes jc-marquee-animation {
  from {
    transform: translateX($jc-marquee-width);
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
  width: $jc-marquee-width;
  transform: translateX(-50%);
  font-size: $jc-font-size-large;
  color: $jc-color-white;
  overflow: hidden;
  .jc-marquee-item {
    display: block;
    white-space: nowrap;
    position: absolute;
    transform: translateX($jc-marquee-width);
    animation-name: jc-marquee-animation;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    .jc-marquee-text {
      display: inline-block;
      min-width: $jc-marquee-width;
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
