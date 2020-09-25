<template>
  <el-dialog title="新增设备" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose" top="35vh">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item prop="deviceName" label="设备名称" :rules="rules.NOT_NULL">
        <el-input v-model="form.deviceName" placeholder="请输入设备名称"></el-input>
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
import { NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'SystemDeviceManage',
  mixins: [FormMixins],
  data() {
    return {
      loading: false,
      rules: {
        NOT_NULL
      }
    }
  },
  methods: {
    formatFormData() {
      return { deviceName: '' }
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
