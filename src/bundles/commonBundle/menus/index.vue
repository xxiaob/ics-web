<template>
  <section>
    <el-menu :default-active="menuActive" @select="menuSelect" :collapse="isCollapse">
      <template v-for="menu in menus">
        <el-submenu :index="menu.index" class="jc-menu-item" :key="menu.id" v-if="menu.children && menu.children.length">
          <template slot="title">
            <i class="jc-menu-icon iconfont" :class="menu.icon"></i>
            <span class="jc-menu-arrow-title" slot="title">{{menu.name}}</span>
          </template>
          <el-menu-item v-for="item in menu.children" :index="item.index" :key="item.id">{{item.name}}</el-menu-item>
        </el-submenu>
        <el-menu-item :index="menu.index" class="jc-menu-item" :key="menu.id" v-else>
          <i class="jc-menu-icon iconfont" :class="menu.icon"></i>
          <span class="jc-menu-arrow-title" slot="title">{{menu.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </section>
</template>

<script>
import { mapState } from 'vuex'
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
      menuActive: this.$route.name,
      newWindowRouter: ['commandScreen', 'dataScreen'] //设置新窗口打开的路由
    }
  },
  computed: {
    ...mapState('user', { menus: state => state.menus })
  },
  watch: {
    '$route'(to) {
      console.log('Header 路由切换，当前路由', to.name)
      this.menuActive = to.name
    }
  },
  methods: {
    menuSelect(index, path) {
      //菜单点击
      console.log('menus', index, path)
      this.menuActive = index
      if (this.newWindowRouter.includes(index)) {
        const { href } = this.$router.resolve({ name: index })

        window.open(href, '_blank')
      } else {
        this.$router.push({ name: index })
      }
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
