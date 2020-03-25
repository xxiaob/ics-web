<template>
  <header class="jc-header">

  </header>
</template>

<script>
export default {
  name: 'CommonHeader',
  data() {
    return {
      menuActive: '1-4-1'
    }
  },
  created() {

  },
  methods: {
    //菜单点击
    handleSelect(key) {
      this.menuActive = key
      this.$router.push(key)
    }
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
