<template>
  <section class="jc-main-body">
    <main-header></main-header>
    <section class="jc-main-container">
      <main-menus></main-menus>
      <router-view />
    </section>
  </section>
</template>
<script>
export default {
  name: 'PageContentBase',
  components: {
    MainHeader: () => import('@/bundles/commonBundle/header'), //引入头部
    MainMenus: () => import('@/bundles/commonBundle/menus')//引入左侧导航
  }
}
</script>
<style lang="scss" scoped>
.jc-main-body {
  position: relative;
  width: 100%;
  height: 100%;
}
.jc-main-container {
  position: absolute;
  top: $jc-header-height;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
/deep/ .jc-main-container-warp {
  position: absolute;
  min-width: $jc-min-width;
  min-height: $jc-min-height;
  top: 0;
  left: 200px;
  right: 0;
  bottom: 0;
  overflow: auto;
}
</style>
