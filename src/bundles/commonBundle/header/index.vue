<template>
  <header class="jc-header">
    <el-menu :default-active="menuActive" class="jc-header-menus" @select="menuSelect" mode="horizontal">
      <el-submenu index="myMenu" :popper-append-to-body="false">
        <template slot="title"><i class="jc-user-header"></i>杨超</template>
        <el-menu-item index="resetPwd">修改密码</el-menu-item>
        <el-menu-item index="loginOut">退出登录</el-menu-item>
      </el-submenu>
    </el-menu>
  </header>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { getUser } from '@/libs/storage'

export default {
  name: 'CommonHeader',
  data() {
    return {
      menuActive: ''
    }
  },
  created() {
    //设置用户信息
    // const user = getUser()

    // if (user) {
    //   this.setUser(user)
    // } else {
    //   this.$router.push(`/login?callbackUrl=${this.$router.history.current.fullPath.split('?')[0]}`)
    // }
  },
  computed: {
    ...mapState('user', {
      user: state => state.user
    }),
    ...mapGetters('user', { isLogin: 'isLogin' })
  },
  methods: {
    ...mapMutations('user', [
      'setUser', 'loginOut'
    ]),
    //菜单选择
    menuSelect(index, path) {
      console.log('header', index, path)

      if (index === 'loginOut') {
        // loginout().then(() => {
        //   //退出登录 清空数据
        //   this.loginOut()
        //   this.$message.success('退出成功')
        //   this.$router.push({ name: 'login' })
        // })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-header {
  position: relative;
  width: 100%;
  height: $jc-header-height;
  background-color: #ffffff;
  z-index: 99;
}
.jc-header-menus {
  float: right;
  background-color: transparent;

  /deep/ .el-menu--popup {
    text-align: center;
    min-width: 150px;
    > .el-menu-item {
      min-width: 150px;
    }
    &:before {
      top: -3px;
      display: block;
      position: absolute;
      border-width: 6px;
      border-color: $jc-color-white $jc-color-white transparent transparent;
      border-style: solid;
      transform: rotate(-45deg);
      left: 50%;
      margin-left: -6px;
    }
  }
}
.jc-user-header {
  display: inline-block;
  width: $jc-header-height / 2;
  height: $jc-header-height / 2;
  margin-right: 10px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(/static/images/user-header.png);
  vertical-align: middle;
  border-radius: 50%;
}
</style>
