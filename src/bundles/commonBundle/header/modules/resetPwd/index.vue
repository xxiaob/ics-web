<template>
  <el-dialog title="修改密码" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="旧密码" prop="oldPWD" :rules="rules.Len50">
        <el-input v-model="form.oldPWD" type="password" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPWD" :rules="rules.Len50">
        <el-input v-model="form.newPWD" type="password" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="reNewPWD" :rules="rules.pwd">
        <el-input v-model="form.reNewPWD" type="password" placeholder="请再次输入新密码"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import md5 from 'md5'
import { updPwd } from '@/api/user'
import { getStringRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'SystemMenusManage',
  mixins: [FormMixins],
  data() {
    return {
      loading: false,
      rules: {
        Len50: getStringRule(1, 50),
        pwd: [...getStringRule(1, 50), { validator: (rule, value, callback) => {
          if (this.form.newPWD == value) {
            callback()
          } else {
            callback(new Error('两次密码不一致'))
          }
        } }]
      }
    }
  },
  methods: {
    formatFormData() {
      return { oldPWD: '', newPWD: '', reNewPWD: '' }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          updPwd({ oldPWD: md5(this.form.oldPWD), newPWD: md5(this.form.newPWD) }).then(() => {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.$emit('save-success')
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>
