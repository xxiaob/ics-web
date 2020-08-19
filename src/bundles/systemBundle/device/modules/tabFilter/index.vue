<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="deviceType" label="设备类型">
        <el-select v-model="form.deviceType" placeholder="设备类型">
          <el-option v-for="item in deviceTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="deviceName" label="设备名称">
        <el-input v-model="form.deviceName" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item prop="ipAddress" label="IP地址">
        <el-input v-model="form.ipAddress" placeholder="请输入IP地址"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { DEVICE_TYPES } from '@/constant/Dictionaries'
export default {
  name: 'SystemDeviceFilter',
  data() {
    return {
      deviceTypes: DEVICE_TYPES.VALUES,
      form: {
        deviceType: '',
        deviceName: '',
        ipAddress: ''
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    onSubmit() {
      this.$emit('filter', this.form)
    }
  }
}
</script>
