<template>
  <div class="jc-welcome-warp">
    <img src="./assets/bg.png" class="jc-welcome-bg" />
    <div class="jc-welcome-content" :style="welcomeLogo">
      <router-link :to="{name: 'specialControl'}" tag="div" class="jc-welcome-item jc-icon1"></router-link>
      <div class="jc-welcome-item jc-icon2"></div>
      <div class="jc-welcome-item jc-icon3"></div>
      <a href="http://36.153.138.122:10002/eUrbanMIS/openconstructionwithoutlogin.htm?userName=%E5%9F%8E%E7%AE%A1%E5%B1%80%E6%89%A7%E6%B3%95&password=12345678#MontiorMgr" target="_blank" class="jc-welcome-item jc-icon4"></a>
      <router-link :to="{name: 'intelligenceControl'}" tag="div" class="jc-welcome-item jc-icon5"></router-link>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'IndexWelcome',
  data() {
    return {
      list: []
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

  }
}
</script>
<style lang="scss" scoped>
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
  bottom: 80px;
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
