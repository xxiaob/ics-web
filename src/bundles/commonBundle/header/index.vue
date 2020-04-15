<template>
  <header class="jc-header">
    <img src="/static/images/header-logo.png" class="jc-header-logo" />
    <div class="jc-header-menus">
      <div class="jc-user-warp">
        <i class="jc-user-header"></i>杨超
        <i class="jc-arrow-icon el-icon-arrow-right"></i>
        <div class="jc-menu-popup">
          <div class="jc-menu-item">修改密码</div>
          <div class="jc-menu-item" @click="logout">退出登录</div>
        </div>
      </div>
    </div>
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
    const user = getUser()

    if (user) {
      this.setUser(user)
    } else {
      this.$router.push(`/login?callbackUrl=${this.$router.history.current.fullPath.split('?')[0]}`)
    }
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
    logout() {
      this.loginOut()
      this.$message.success('退出成功')
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-header {
  position: relative;
  width: 100%;
  height: $jc-header-height;
  z-index: 99;
  @include jc-header-style;
}
.jc-header-logo {
  width: auto;
  height: 100%;
}
.jc-header-menus {
  float: right;
  background-color: transparent;
  .jc-user-warp {
    position: relative;
    color: $jc-color-white;
    padding: 0 $jc-default-dis;
    height: $jc-header-height;
    line-height: $jc-header-height;
    opacity: 0.8;
    cursor: pointer;
    &:hover {
      opacity: 1;
      background-color: mix($jc-color-white, $jc-menu-bg-color, 10%);
      .jc-arrow-icon {
        transform: rotate(90deg);
      }
      .jc-menu-popup {
        transform: scaleY(1);
      }
    }
  }
  .jc-arrow-icon {
    transform: rotate(0);
    transition: transform 0.4s;
    will-change: transform;
    font-size: $jc-font-size-smaller;
  }
}
.jc-menu-popup {
  position: absolute;
  right: 5px;
  top: $jc-header-height + 5px;
  background-color: $jc-color-white;
  box-shadow: $jc-box-shadow;
  border-radius: $jc-border-radius-base/2;
  transform: scaleY(0);
  transition: transform 0.3s ease-out;
  transform-origin: 0 0;
  will-change: transform;
  &:before {
    content: "";
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
  .jc-menu-item {
    min-width: 140px;
    height: $jc-menu-height;
    line-height: $jc-menu-height;
    text-align: center;
    color: $jc-color-text-secondary;
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
