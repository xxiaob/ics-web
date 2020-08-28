<template>
  <el-dialog :title="options ? '编辑系统名称':'新增系统名称'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="系统域名" prop="domain" :rules="rules.NOT_NULL">
        <el-input v-model="form.domain" placeholder="请输入系统域名"></el-input>
      </el-form-item>
      <el-form-item label="系统名称" prop="systemName" :rules="rules.Len50">
        <el-input v-model="form.systemName" placeholder="请输入系统名称"></el-input>
      </el-form-item>
      <el-form-item label="登录页logo" prop="domainLogo" :rules="rules.NOT_NULL">
        <upload-one-img :url.sync="form.domainLogo" :isShowAdvice="isShowAdvice"></upload-one-img>
      </el-form-item>
      <el-form-item label="登录页背景" prop="firstPageLogo">
        <upload-one-img :url.sync="form.firstPageLogo"></upload-one-img>
      </el-form-item>
      <el-form-item label="登录窗背景" prop="firstPageLoginLogo">
        <upload-one-img :url.sync="form.firstPageLoginLogo"></upload-one-img>
      </el-form-item>
      <el-form-item label="登录窗位置" prop="loginLogoLocation" :rules="rules.NOT_NULL">
        <el-radio v-model="form.loginLogoLocation" v-for="item in loginPosition" :label="item.value" :key="item.key">{{item.label}}</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { save } from '@/api/domainLogo'
import { getStringRule, NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { LOGIN_WINDOWS_POSITION } from '@/constant/Dictionaries'


let defaultForm = { systemName: '', domain: '', domainLogo: '', firstPageLogo: '', firstPageLoginLogo: '', loginLogoLocation: 3 }

export default {
  name: 'SystemNameManage',
  mixins: [FormMixins],
  data() {
    return {
      loading: false,
      rules: {
        NOT_NULL,
        Len50: getStringRule(1, 50)
      },
      loginPosition: LOGIN_WINDOWS_POSITION.VALUES,
      isShowAdvice: true // 显示提示文本
    }
  },
  components: {
    uploadOneImg: () => import('@/components/JcUpload/uploadOneImg.vue')
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
          save(this.form).then(() => {
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
<style lang="scss" scoped>
</style>
