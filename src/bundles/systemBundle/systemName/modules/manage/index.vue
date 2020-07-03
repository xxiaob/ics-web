<template>
  <el-dialog :title="options ? '编辑系统名称':'新增系统名称'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="系统域名" prop="domain" :rules="rules.Len50">
        <el-input v-model="form.domain" placeholder="请输入系统域名"></el-input>
      </el-form-item>
      <el-form-item label="系统名称" prop="name" :rules="rules.Len50">
        <el-input v-model="form.name" placeholder="请输入系统名称"></el-input>
      </el-form-item>
      <el-form-item label="系统logo" prop="logo" :rules="rules.NOT_NULL">
        <div class="img" v-show="form.logo">
          <img :src="form.logo" alt="" width="100%">
          <img class="jc-close" src="@/bundles/taskBundle/assets/close.png" alt="" title="删除" @click.stop="handleRemove">
        </div>
        <el-upload v-show="!form.logo" :action="uploadUrl" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" :headers="uploadHeaders" :before-upload="handleBeforeUpload" :on-success="handleSuccess" :show-file-list="false">
          <el-button size="small" type="primary" :loading="loading">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/api/API'
import { positionSave } from '@/api/position'
import { getToken } from '@/libs/storage'
import { getStringRule, NOT_NULL, getIntegerRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { name: '', domain: '', logo: '' }

export default {
  name: 'SystemNameManage',
  mixins: [FormMixins],
  data() {
    return {
      uploadUrl: process.env.API_HOST.base + api.upload,
      uploadHeaders: { token: getToken() },
      loading: false,
      rules: {
        NOT_NULL,
        Len50: getStringRule(1, 50),
        Int: getIntegerRule()
      }
    }
  },
  methods: {
    formatFormData() {
      if (this.options) {
        return { ...this.options }
      } else {
        return { ...defaultForm }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.loginType = this.form.type.join(',')
          positionSave(this.form).then(() => {
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
    },
    handleRemove() {
      this.form.logo = ''
    },
    handleBeforeUpload() {
      this.loading = true
    },
    handleSuccess(res) {
      if (res.resCode) {
        this.form.logo = res.resData.url
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.resMsg.msgText)
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.img {
  position: relative;
  .jc-close {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }
}
</style>
