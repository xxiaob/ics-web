<template>
  <el-dialog :title="options ? '编辑职位':'新增职位'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="职位名称" prop="positionName" :rules="rules.Len50">
        <el-input v-model="form.positionName" placeholder="请输入职位名称"></el-input>
      </el-form-item>
      <el-form-item label="允许登录终端" prop="type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox v-for="item in types" :label="item.value" :key="item.value" name="type">{{item.label}}</el-checkbox>
        </el-checkbox-group>
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
import { LOGIN_DEVICE_TYPES } from '@/constant/Dictionaries'

let defaultForm = { positionName: '' }

export default {
  name: 'SystemPositionManage',
  mixins: [FormMixins],
  data() {
    return {
      loading: false,
      types: LOGIN_DEVICE_TYPES.VALUES,
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
          positionId: this.options.positionId,
          positionName: this.options.positionName,
          type: []
        }
      } else {
        return { ...defaultForm, type: [] }
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
