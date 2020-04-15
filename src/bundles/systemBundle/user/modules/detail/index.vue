<template>
  <el-dialog title="用户详情" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">杨超</el-avatar>
    <div class="jc-info-item">
      <label class="jc-info-label">用户名称：</label>
      <div class="jc-info-content">杨超</div>
    </div>
    <div class="jc-info-item">
      <label class="jc-info-label">登录账号：</label>
      <div class="jc-info-content">杨超</div>
    </div>
    <div class="jc-info-item">
      <label class="jc-info-label">手机号：</label>
      <div class="jc-info-content">杨超</div>
    </div>
    <div class="jc-info-item">
      <label class="jc-info-label">执法证号：</label>
      <div class="jc-info-content">杨超</div>
    </div>
    <div class="jc-info-item">
      <label class="jc-info-label">胸牌号：</label>
      <div class="jc-info-content">杨超</div>
    </div>
    <div class="jc-info-item">
      <label class="jc-info-label">职位：</label>
      <div class="jc-info-content">杨超</div>
    </div>
    <div class="jc-info-item">
      <label class="jc-info-label">默认接收人：</label>
      <div class="jc-info-content">杨超</div>
    </div>
    <div class="jc-info-item">
      <label class="jc-info-label">所属组织：</label>
      <div class="jc-info-content">杨超</div>
    </div>
    <div class="jc-info-item">
      <label class="jc-info-label">角色：</label>
      <div class="jc-info-content">杨超</div>
    </div>
  </el-dialog>
</template>
<script>
import { userGet } from '@/api/user'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { userName: '', account: '', phone: '', positionId: '', chestNbr: '', lawNbr: '', isDefReceiver: '0' }

export default {
  name: 'SystemUserDetail',
  mixins: [FormMixins],
  props: ['userId'],
  data() {
    return {
    }
  },
  methods: {
    initData() {
      userGet(this.userId).then(res => {

      })
    },
    formatFormData() {
      if (this.options) {
        return {
          userId: this.options.userId,
          userName: this.options.userName,
          account: this.options.account,
          phone: this.options.phone,
          chestNbr: this.options.chestNbr,
          lawNbr: this.options.lawNbr,
          isDefReceiver: this.options.isDefReceiver,
          roleIds: this.options.roleIds || [],
          orgId: this.options.orgId,
          positionId: this.options.positionId
        }
      } else {
        return { ...defaultForm, orgId: this.orgId, roleIds: [] }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$jc-info-item-height: 20px;
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
    line-height: $jc-info-item-height;
  }
}
</style>
