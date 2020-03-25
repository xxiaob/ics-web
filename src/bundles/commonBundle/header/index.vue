<template>
  <header class="jc-header"></header>
</template>

<script>
export default {
  name: 'CommonHeader',
  data() {
    return {

    }
  },
  created() {

  }
}
</script>
<style lang="scss" scoped>
.jc-header {
  position: relative;
  width: 100%;
  height: $jc-header-height;
  background-color: #ffffff;
  z-index: 99;
}
</style>
