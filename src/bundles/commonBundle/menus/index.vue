<template>
  <section class="jc-menu-space">
    <el-menu :default-active="menuActive" @select="handleSelect" :collapse="isCollapse">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">导航一</span>
        </template>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
        <el-menu-item index="1-3">选项3</el-menu-item>
        <el-submenu index="1-4">
          <span slot="title">选项4</span>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
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
/deep/ .el-menu--collapse {
  width: $jc-menu-hide-width;
  .el-menu-item {
    padding: 0;
  }
}
</style>
