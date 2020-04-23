<template>
  <div class="jc-custom-area" :class="{'jc-area-show': visible}">
    <i class="jc-custom-item iconfont icontuodong" title="新增区域" v-if="type == 2"></i>
    <i class="jc-custom-item iconfont icontuodong" title="保存设置"></i>
    <i class="jc-custom-item iconfont icontuodong" title="重置"></i>
  </div>
</template>
<script>
let JcMapUtils //用户承接工具类

export default {
  name: 'SystemOrganizationCustomArea',
  props: ['visible', 'type'],
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
  bottom: 0;
  left: 50%;
  margin: 0 auto;
  z-index: 8;
  padding: 0 6px;
  background-color: rgba($color: $jc-menu-bg-color, $alpha: 0.6);
  border-radius: $jc-border-radius-base;
  text-align: center;
  transform: translate(-50%, 100%);
  opacity: 0;
  transition: transform 0.3s, opacity 0.3s;
  &.jc-area-show {
    opacity: 1;
    transform: translate(-50%, 0);
  }
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
