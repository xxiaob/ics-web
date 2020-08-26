<template>
  <el-dialog :title="options ? '编辑系统':'新增系统'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="系统名称" prop="systemName" :rules="rules.Len50">
        <el-input v-model="form.systemName" placeholder="请输入系统名称"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model.number="form.order" placeholder="请输入排序"></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <el-input v-model="form.url" placeholder="请输入链接"></el-input>
      </el-form-item>
      <el-form-item label="启用" prop="enabled" :rules="rules.NOT_NULL">
        <el-switch v-model="form.enabled" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="新窗口打开" prop="newWindow" :rules="rules.NOT_NULL">
        <el-switch v-model="form.newWindow" :active-value="1" :inactive-value="0"></el-switch>
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
import { save } from '@/api/systemIndex'
import { getStringRule, NOT_NULL, getIntegerRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = {
  enabled: 0,
  logo: '',
  newWindow: 0,
  order: 0,
  systemName: '',
  url: ''
}

export default {
  name: 'SystemBaseBusinessSystemManage',
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
        return { ...this.options, recordId: this.options.id }
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
