<template>
  <div class="mv-main-body">
    <main-header></main-header>
    <section class="mv-main-container">
      <main-menus></main-menus>
      <router-view />
    </section>
  </div>
</template>

<script>
export default {
  components: {
    MainHeader: () => import('@/bundles/commonBundle/header'),//引入头部
    MainMenus: () => import('@/bundles/commonBundle/menus')//引入左侧导航
  }
}
</script>

<style src="./index.scss" lang="scss"></style>
