<template>
  <el-dialog :title="options ? '编辑菜单':'新增菜单'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="菜单名称" prop="resName" :rules="rules.Len50">
        <el-input v-model="form.resName" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input v-model="form.icon" placeholder="请输入菜单图标"></el-input>
      </el-form-item>
      <el-form-item label="菜单地址" prop="url" :rules="rules.Len50">
        <el-input v-model="form.url" placeholder="请输入菜单地址"></el-input>
      </el-form-item>
      <el-form-item label="序号" prop="sort" :rules="rules.Int">
        <el-input v-model.number="form.sort" placeholder="请输入序号"></el-input>
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
import { getStringRule, getIntegerRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { resName: '', sort: 0, pid: '', url: '', icon: '' }

export default {
  name: 'SystemPositionManage',
  mixins: [FormMixins],
  data() {
    return {
      loading: false,
      rules: {
        Len50: getStringRule(1, 50),
        Int: getIntegerRule()
      }
    }
  },
  methods: {
    formatFormData() {
      if (this.options) {
        return {
          resId: this.options.resId,
          resName: this.options.resName,
          sort: this.options.sort,
          pid: this.options.pid,
          url: this.options.url,
          icon: this.options.icon
        }
      } else {
        return { ...defaultForm }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
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
