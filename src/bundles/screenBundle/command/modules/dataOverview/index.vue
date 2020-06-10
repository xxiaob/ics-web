<template>
  <div class="jc-overview" :class="{'jc-active': viewShow}" @click="viewShow = true">
    <div class="jc-overview-contant" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <div class="jc-overview-header jc-title-sign">数据概览</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ScreenCommandDataOverview',
  data() {
    return {
      viewShow: false,
      loading: false
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.initData) //监听行级别切换
  },
  methods: {
    initData() {

    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('org-change', this.initData)
  }
}
</script>
<style lang="scss" scoped>
.jc-overview {
  position: absolute;
  width: 40px;
  height: 40px;
  left: $jc-default-dis;
  bottom: $jc-default-dis;
  z-index: 8;
  cursor: pointer;
  background: url(./assets/bg.png) no-repeat left bottom;
  background-size: 40px;
  overflow: hidden;
  transform: translateZ(0);
  transition: width 0.3s, height 0.3s;

  .jc-overview-contant {
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    width: 300px;
    height: 150px;
    opacity: 0;
    padding: $jc-default-dis/2;
    background-color: $jc-color-white;
    transition: opacity 0.4;
  }
  &.jc-active {
    width: 300px;
    height: 150px;
    .jc-overview-contant {
      opacity: 1;
    }
  }
  .jc-overview-header {
  }
}
</style>
