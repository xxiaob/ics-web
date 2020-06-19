<template>
  <section class="jc-main-body">
    <router-view />
  </section>
</template>
<script>
export default {
  name: 'FullPage'
}
</script>
<style lang="scss" scoped>
.jc-main-body {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
