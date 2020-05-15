<template>
  <section>
    <el-menu :default-active="menuActive" @select="menuSelect" :collapse="isCollapse">
      <el-menu-item index="taskEventManage" class="jc-menu-item">
        <i class="jc-menu-icon el-icon-setting"></i>
        <span class="jc-menu-arrow-title" slot="title">事件管理</span>
      </el-menu-item>
      <el-submenu index="question" class="jc-menu-item">
        <template slot="title">
          <i class="jc-menu-icon el-icon-setting"></i>
          <span class="jc-menu-arrow-title" slot="title">问题管理</span>
        </template>
        <el-menu-item index="questionProcess">问题处理</el-menu-item>
      </el-submenu>
      <el-submenu index="task" class="jc-menu-item">
        <template slot="title">
          <i class="jc-menu-icon el-icon-setting"></i>
          <span class="jc-menu-arrow-title" slot="title">任务管理</span>
        </template>
        <el-menu-item index="taskProcess">任务处理</el-menu-item>
        <el-menu-item index="taskSearch">任务查询</el-menu-item>
      </el-submenu>
      <el-submenu index="system" class="jc-menu-item">
        <template slot="title">
          <i class="jc-menu-icon el-icon-setting"></i>
          <span class="jc-menu-arrow-title" slot="title">系统设置</span>
        </template>
        <el-menu-item index="systemOrganization">组织管理</el-menu-item>
        <el-menu-item index="systemAreaType">区域类型</el-menu-item>
        <el-menu-item index="systemRole">角色管理</el-menu-item>
        <el-menu-item index="systemUser">用户管理</el-menu-item>
        <el-menu-item index="systemPosition">职位管理</el-menu-item>
        <el-menu-item index="systemMenus">菜单管理</el-menu-item>
        <el-menu-item index="systemDevice">设备管理</el-menu-item>
        <el-menu-item index="systemDeviceUpdate">设备升级</el-menu-item>
        <el-menu-item index="systemGrid">网格设置</el-menu-item>
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
.jc-menu-arrow-title {
  vertical-align: baseline;
}
/deep/ .el-menu {
  background-color: transparent;
  border-right: none;

  &.el-menu--collapse {
    width: $jc-menu-hide-width;
  }

  .el-submenu__icon-arrow {
    color: $jc-color-white;
  }
  .jc-menu-icon {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: $jc-menu-hide-width;
    height: $jc-menu-height;
    line-height: $jc-menu-height;
    text-align: center;
    color: $jc-color-white;
  }

  .jc-menu-item {
    position: relative;
    &.el-menu-item,
    > .el-submenu__title {
      position: relative;
      padding-left: $jc-menu-hide-width !important;

      &:before {
        content: "";
        width: 3px;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        background-color: $jc-menu-active-bg;
        transform: scaleY(0);
        transition: transform 0.3s;
        will-change: transform;
      }
      &:hover:before {
        transform: scaleY(1);
      }
    }
    &.is-active {
      > .el-submenu__title {
        &:before {
          transform: scaleY(1);
        }
      }
    }
    .el-menu {
      background-color: $jc-submenu-bg-color;
      .el-menu-item {
        &:hover {
          background-color: $jc-menu-bg-color;
        }
      }
    }
  }

  .el-menu-item,
  .el-submenu__title {
    color: $jc-color-white;
    padding-right: 0;
    height: $jc-menu-height;
    line-height: $jc-menu-height;
    background-color: transparent;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
    &.is-active {
      background-color: $jc-menu-active-bg !important;
    }
  }
}
</style>
