<template>
  <el-card class="jc-enter-router">
    <div class="jc-router-info">
      <div class="jc-info jc-current-organization">
        <span class="jc-info-label">当前组织: </span>
        <span class="jc-organization" v-text="user && user.orgName"></span>
      </div>
      <div class="jc-info jc-router">
        <span class="jc-info-label">入口路由: </span>
        <el-input class="jc-router-input" placeholder="您可以输入登录后跳转的页面地址，若您忽略，默认登录后显示一级页面">
        </el-input>
      </div>
    </div>
    <div class="jc-router-btns jc-flex-warp">
      <el-button type="primary" size="mini" @click="manage(scope.row)">保存</el-button>
      <el-button size="mini" @click="del(scope.row)">取消</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'SystemBaseEntryRoute',
  props: {
    user: {
      type: Object,
      default: ()=>{}
    }
  },
  mounted() {
    console.log('user', this.user)
  }
}
</script>

<style lang="scss" scoped>
.jc-enter-router {
  padding: 20px 100px;

  .jc-router-info {
    padding-bottom: 50px;

    .jc-info {
      margin-bottom: 30px;

      .jc-info-label {
        margin-right: 20px;
      }

      .jc-organization {
        color: #999;
      }

      .jc-router-input {
        width: 500px;
      }
    }
  }

  .jc-router-btns {
    justify-content: center;
  }
}
</style>
