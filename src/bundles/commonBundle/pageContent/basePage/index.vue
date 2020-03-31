<template>
  <section class="jc-main-body" :class="{'jc-menu-collapse': isCollapse}">
    <main-header></main-header>
    <div class="jc-menu-warp">
      <i class="jc-menu-collapse-control" :class="isCollapse ? 'el-icon-s-fold':'el-icon-s-unfold'" @click="isCollapse = !isCollapse"></i>
      <main-menus class="jc-menu-space" :isCollapse="isCollapse"></main-menus>
    </div>
    <div class="jc-main-container">
      <router-view />
    </div>
  </section>
</template>
<script>
export default {
  name: 'PageContentBase',
  components: {
    MainHeader: () => import('@/bundles/commonBundle/header'), //引入头部
    MainMenus: () => import('@/bundles/commonBundle/menus')//引入左侧导航
  },
  data() {
    return {
      isCollapse: window.innerWidth < 1300 ? true : false
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-main-body {
  position: relative;
  width: 100%;
  height: 100%;
}
.jc-menu-warp {
  position: absolute;
  top: $jc-header-height;
  width: $jc-menu-width;
  padding-top: 30px;
  z-index: 9;
  left: 0;
  background-color: #ffffff;
  bottom: 0;
  overflow: hidden;
  transition: width 0.4s;
  transform: translateZ(0);
  will-change: width;
  .jc-menu-collapse-control {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    background-color: $jc-bg-color;
  }
}
.jc-menu-space {
  width: $jc-menu-width;
  height: 100%;
}
.jc-main-container {
  position: absolute;
  top: $jc-header-height;
  left: $jc-menu-width;
  right: 0;
  bottom: 0;
  overflow: auto;
  transition: left 0.4s;
  transform: translateZ(0);
  will-change: left;
}
.jc-menu-collapse {
  .jc-main-container {
    left: $jc-menu-hide-width;
  }
  .jc-menu-warp {
    width: $jc-menu-hide-width;
  }
}
/deep/ .jc-main-full-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/deep/ .jc-main-container-warp {
  position: relative;
  padding: $jc-default-dis;
  min-width: $jc-min-width;
  min-height: $jc-min-height;
}
</style>
