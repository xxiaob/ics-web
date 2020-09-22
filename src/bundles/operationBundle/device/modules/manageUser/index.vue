<template>
  <el-dialog title="绑定用户" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose" top="35vh">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="所属组织">
        <span>{{orgName}}</span>
      </el-form-item>
      <el-form-item label="用户名称" prop="userId" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.userId" placeholder="请选择用户" filterable>
          <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { deviceBind } from '@/api/device'
import { userListByOrg } from '@/api/user'
import { SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'SystemDeviceManageUser',
  mixins: [FormMixins],
  data() {
    return {
      orgName: '',
      loading: false,
      rules: {
        SELECT_NOT_NULL
      },
      users: []
    }
  },
  methods: {
    async getUsers(orgId) {
      this.users = await userListByOrg([orgId])
    },
    formatFormData() {
      if (this.options) {
        const { deviceId, orgId, orgName } = this.options

        this.getUsers(orgId)
        this.orgName = orgName
        return { userId: '', deviceIds: [deviceId] }
      } else {
        return { userId: '' }
      }
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmSubmit()
        }
      })
    },
    async confirmSubmit() {
      this.loading = true
      try {
        await deviceBind({ ...this.form })
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.$emit('save-success')
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    }
  }
}
</script>
