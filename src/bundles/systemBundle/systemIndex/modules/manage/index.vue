<template>
  <el-dialog :title="options ? '编辑系统':'新增系统'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="系统名称" prop="name" :rules="rules.Len50">
        <el-input v-model="form.name" placeholder="请输入系统名称"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model.number="form.sort" placeholder="请输入排序"></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="link" :rules="rules.NOT_NULL">
        <el-input v-model="form.link" placeholder="请输入链接"></el-input>
      </el-form-item>
      <el-form-item label="启用" prop="on" :rules="rules.NOT_NULL">
        <el-switch v-model="form.on" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="新窗口打开" prop="on" :rules="rules.NOT_NULL">
        <el-switch v-model="form.on" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="logo" prop="logo" :rules="rules.NOT_NULL">
        <upload-one-img :url.sync="form.logo"></upload-one-img>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { positionSave } from '@/api/position'
import { getStringRule, NOT_NULL, getIntegerRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { name: '', logo: '', sort: 0, on: 1, link: '' }

export default {
  name: 'SystemIndexManage',
  mixins: [FormMixins],
  data() {
    return {
      loading: false,
      rules: {
        NOT_NULL,
        Len50: getStringRule(1, 50),
        Int: getIntegerRule()
      }
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
