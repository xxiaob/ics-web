<template>
  <div class="jc-custom-area" v-show="visible">
    <i class="jc-custom-item iconfont icontuodong"></i>
    <i class="jc-custom-item iconfont icontuodong"></i>
    <i class="jc-custom-item iconfont icontuodong"></i>
    <i class="jc-custom-item iconfont icontuodong"></i>
  </div>
</template>
<script>
let JcMapUtils //用户承接工具类

export default {
  name: 'SystemOrganizationCustomArea',
  props: ['visible'],
  data() {
    return {
      list: [],
      adcode: ''
    }
  },
  methods: {
    initData(util) {
      this.adcode = ''
      JcMapUtils = util
    }
  }
}
</script>
<style lang="scss" scoped>
$jc-item-width: 36px;
.jc-custom-area {
  position: absolute;
  width: $jc-item-width * 5;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 8;
  background-color: rgba($color: $jc-menu-bg-color, $alpha: 0.6);
  border-radius: $jc-border-radius-base;
  text-align: center;
}
.jc-custom-item {
  display: inline-block;
  vertical-align: middle;
  width: $jc-item-width;
  height: $jc-item-width;
  line-height: $jc-item-width;
  color: $jc-color-white;
  cursor: pointer;
  &:hover,
  &.jc-active {
    color: $jc-color-primary;
  }
}
</style>
