<template>
  <div class="jc-data-screen">
    <img src="./assets/data-bg.jpg" class="jc-screen-bg" />
  </div>
</template>
<script>
export default {
  name: 'DemoDataScreenDemo'
}
</script>
<style lang="scss" scoped>
.jc-data-screen {
  position: relative;
  width: 100%;
  height: 100%;
  // background: url(./assets/data-bg.jpg) no-repeat center;
  // background-size: 100% 100%;
  .jc-screen-bg {
    display: block;
    height: 100%;
  }
}
</style>
