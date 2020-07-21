<template>
  <div class="jc-screen-header">

  </div>
</template>
<script>
export default {
  name: 'ScreenDataStatisticsHeader',
  data() {
    return {
      title: '--'
    }
  },
  created() {
    this.$EventBus.$on('data-statistics-init-success', this.initData) //监听基础数据初始化完成
  },
  methods: {
    initData() {

    }
  },
  beforeDestroy() {
    this.$EventBus.$off('data-statistics-init-success', this.initData)
  }
}
</script>
<style lang="scss" scoped>
.jc-screen-header {
  position: relative;
  width: 100%;
  height: 160px;
  background: url(./assets/header-bg.png) no-repeat center;
  background-size: auto 100%;
}
</style>
