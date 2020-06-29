<template>
  <div class="jc-welcome-warp">
    <img src="./assets/bg.png" class="jc-welcome-bg" />
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
</style>
