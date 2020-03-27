<template>
  <section class="jc-menu-space">
    <el-menu :default-active="menuActive" @select="handleSelect" :collapse="isCollapse">
      <el-submenu index="system">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">系统设置</span>
        </template>
        <el-menu-item index="Organization">组织管理</el-menu-item>
        <el-menu-item index="role">角色管理</el-menu-item>
        <el-menu-item index="user">用户管理</el-menu-item>
        <el-menu-item index="position">职称管理</el-menu-item>
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
/deep/ .el-menu--collapse {
  width: $jc-menu-hide-width;
  .el-menu-item {
    padding: 0;
  }
}
</style>
