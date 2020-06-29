<template>
  <div class="jc-welcome-warp">
    <img src="./assets/bg.png" class="jc-welcome-bg" />
    <div class="jc-welcome-content">
      <router-link :to="{name: 'specialControl'}" tag="div" class="jc-welcome-item jc-icon1"></router-link>
      <div class="jc-welcome-item jc-icon2"></div>
      <div class="jc-welcome-item jc-icon3"></div>
      <router-link :to="{name: 'muckSpecial'}" tag="div" class="jc-welcome-item jc-icon4"></router-link>
      <router-link :to="{name: 'intelligenceControl'}" tag="div" class="jc-welcome-item jc-icon5"></router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'IndexWelcome'
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
  padding-top: 80px;
  display: flex;
  background: url(./assets/head.png) no-repeat top center;
  background-size: auto 60px;
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
