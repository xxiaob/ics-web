<template>
  <section class="jc-menu-space">
    <el-menu :default-active="menuActive" @select="menuSelect" :collapse="isCollapse">
      <el-submenu index="system">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">系统设置</span>
        </template>
        <el-menu-item index="systemOrganization">组织管理</el-menu-item>
        <el-menu-item index="systemRole">角色管理</el-menu-item>
        <el-menu-item index="user">用户管理</el-menu-item>
        <el-menu-item index="position">职位管理</el-menu-item>
        <el-menu-item index="menus">菜单管理</el-menu-item>
      </el-submenu>
    </el-menu>
  </section>
</template>

<script>
export default {
  name: 'CommonMenus',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuActive: this.$route.name
    }
  },
  methods: {
    menuSelect(index, path) {
      //菜单点击
      console.log('menus', index, path)
      this.menuActive = index
      this.$router.push({ name: index })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-menu--collapse {
  width: $jc-menu-hide-width;
  .el-menu-item {
    padding: 0;
  }
}
</style>
