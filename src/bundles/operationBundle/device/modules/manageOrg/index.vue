<template>
  <el-dialog title="设置 所属组织" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose" top="35vh">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item prop="orgId" label="所属组织" :rules="rules.SELECT_NOT_NULL">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false,checkStrictly:true }" clearable @change="orgChange" ref="orgCascader"></el-cascader>
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
import { SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'SystemDeviceManageOrg',
  mixins: [FormMixins],
  props: {
    orgTree: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      loading: false,
      rules: {
        SELECT_NOT_NULL
      }
    }
  },
  methods: {
    orgChange() {
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
    formatFormData() {
      if (this.options) {
        const { deviceIds } = this.options

        return { orgId: '', deviceIds }
      } else {
        return { orgId: '' }
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
