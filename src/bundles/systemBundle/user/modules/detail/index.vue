<template>
  <el-dialog title="用户详情" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="用户名称">
        <span v-text="form.userName"></span>
      </el-form-item>
      <el-form-item label="登录账号">

      </el-form-item>
      <el-form-item label="手机号">

      </el-form-item>
      <el-form-item label="执法证号">

      </el-form-item>
      <el-form-item label="胸牌号">

      </el-form-item>
      <el-form-item label="职位">
        <el-select v-model="form.positionId" placeholder="职位">

        </el-select>
      </el-form-item>
      <el-form-item label="默认接收人">

      </el-form-item>
      <el-form-item label="所属组织">

      </el-form-item>
      <el-form-item label="角色">

      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { useGet } from '@/api/user'
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
      useGet(this.userId).then(res => {

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
