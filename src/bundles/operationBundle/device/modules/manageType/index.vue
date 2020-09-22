<template>
  <el-dialog title="设置 设备类型" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose" top="35vh">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item prop="deviceType" label="设备类型" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.deviceType" placeholder="设备类型">
          <el-option v-for="item in deviceTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
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
import { DEVICE_TYPES } from '@/constant/Dictionaries'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'SystemDeviceManageType',
  mixins: [FormMixins],
  data() {
    return {
      deviceTypes: DEVICE_TYPES.VALUES,
      loading: false,
      rules: {
        SELECT_NOT_NULL
      }
    }
  },
  methods: {
    formatFormData() {
      if (this.options) {
        const { deviceIds } = this.options

        return { deviceType: '', deviceIds }
      } else {
        return { deviceType: '' }
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
