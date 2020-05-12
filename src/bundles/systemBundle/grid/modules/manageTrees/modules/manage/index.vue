<template>
  <el-dialog :title="options ? '编辑网格':'新增网格'" :visible.sync="dialogVisible" width="800px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="上级">
        <span v-text="pNode.name"></span>
      </el-form-item>
      <el-form-item label="网格名称" prop="areaName" :rules="rules.Len50">
        <el-input v-model="form.areaName" placeholder="请输入网格名称"></el-input>
      </el-form-item>
      <el-form-item label="区域类型" prop="areaTypeId" :rules="rules.SELECT_NOT_NULL">
        <el-input v-model="form.areaTypeId" placeholder="请输入区域类型"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="desc" :rules="rules.NOT_NULL">
        <jc-editor v-model="form.desc"></jc-editor>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { organizationSave } from '@/api/organization'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { areaName: '', desc: '', areaTypeId: '' }

export default {
  name: 'SystemGridManage',
  mixins: [FormMixins],
  props: ['pNode'],
  components: {
    JcEditor: () => import('@/components/JcForm/JcEditor')
  },
  data() {
    return {
      loading: false,
      rules: { NOT_NULL, SELECT_NOT_NULL, Len50: getStringRule(1, 50) }
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
          organizationSave({ ...this.form, pid: this.pNode.pid }).then((res) => {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.$emit('save-success', res.orgId)
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
