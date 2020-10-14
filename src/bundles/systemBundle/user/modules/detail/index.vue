<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose">
    <div class="text-center">
      <div class="jc-mb">
        <el-avatar :src="user.photo ? user.photo : '/static/images/user-header.png'" :size="50">{{user.userName}}</el-avatar>
      </div>
      <div class="jc-user-content">
        <div class="jc-info-item">
          <label class="jc-info-label">用户名称：</label>
          <div class="jc-info-content" v-text="user.userName"></div>
        </div>
        <div class="jc-info-item">
          <label class="jc-info-label">登录账号：</label>
          <div class="jc-info-content" v-text="user.account"></div>
        </div>
        <div class="jc-info-item">
          <label class="jc-info-label">手机号：</label>
          <div class="jc-info-content" v-text="user.phone"></div>
        </div>
        <div class="jc-info-item">
          <label class="jc-info-label">执法证号：</label>
          <div class="jc-info-content" v-text="user.lawNbr || '--'"></div>
        </div>
        <div class="jc-info-item">
          <label class="jc-info-label">胸牌号：</label>
          <div class="jc-info-content" v-text="user.chestNbr || '--'"></div>
        </div>
        <div class="jc-info-item">
          <label class="jc-info-label">职位：</label>
          <div class="jc-info-content" v-text="positionNames"></div>
        </div>
        <div class="jc-info-item">
          <label class="jc-info-label">所属组织：</label>
          <div class="jc-info-content" v-text="user.orgName"></div>
        </div>
        <div class="jc-info-item">
          <label class="jc-info-label">角色：</label>
          <div class="jc-info-content" v-text="userRoles"></div>
        </div>
        <div class="jc-info-item">
          <label class="jc-info-label">党员：</label>
          <div class="jc-info-content">{{user.partyMember?'是':'否'}}</div>
        </div>
        <div class="jc-info-title">用户描述</div>
      </div>
    </div>
    <div class="jc-user-description" v-html="user.description"></div>
  </el-dialog>
</template>
<script>
import { userGet } from '@/api/user'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'SystemUserDetail',
  mixins: [FormMixins],
  props: {
    userId: String,
    title: {
      type: String,
      default: '用户详情'
    }
  },
  data() {
    return {
      user: {}
    }
  },
  computed: {
    userRoles() {
      if (this.user.roles && this.user.roles.length) {
        let rolesName = []

        this.user.roles.forEach(item => {
          rolesName.push(item.roleName)
        })
        return rolesName.join('，')
      }
      return '--'
    },
    positionNames() {
      if (this.user.positions && this.user.positions.length) {
        const positionNames = this.user.positions.map(item=>item.positionName)

        return positionNames.join('，')
      }
      return '--'
    }
  },
  methods: {
    async initData() {
      try {
        this.user = await userGet({ userId: this.userId })
      } catch (error) {
        console.log(error)
      }
    },
    formatFormData() {
      return {}
    }
  }
}
</script>
<style lang="scss" scoped>
$jc-info-item-height: 20px;
.jc-user-content {
  display: inline-block;
  text-align: left;
}
.jc-info-item {
  position: relative;
  padding-left: 85px;
  margin-bottom: 10px;
  .jc-info-label {
    position: absolute;
    text-align: right;
    width: 85px;
    line-height: $jc-info-item-height;
    top: 0;
    left: 0;
    color: $jc-color-text-secondary;
  }
  .jc-info-content {
    min-height: $jc-info-item-height;
    line-height: $jc-info-item-height;
  }
}
.jc-info-title {
  margin-bottom: 10px;
  text-align: center;
  font-size: $jc-font-size-medium;
  font-weight: bold;
  color: $jc-color-text-primary;
}
</style>
<style lang="scss">
.jc-user-description {
  position: relative;
  padding: 0 $jc-default-dis;

  img {
    max-width: 100%;
    padding: 10px 0;
  }
}
</style>
