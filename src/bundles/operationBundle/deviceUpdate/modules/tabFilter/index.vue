<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="pkgName" label="应用名称">
        <el-input v-model="form.pkgName" placeholder="请输入应用名称"></el-input>
      </el-form-item>
      <el-form-item prop="deviceType" label="设备类型">
        <el-select v-model="form.deviceType" placeholder="选择设备类型">
          <el-option v-for="(value,key) in deviceTypes" :key="key" :label="value" :value="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="state" label="状态">
        <el-select v-model="form.state" placeholder="选择状态">
          <el-option v-for="(value,key) in states" :key="key" :label="value" :value="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { deviceTypes, states } from '../../const'
export default {
  name: 'SystemDeviceUpdateFilter',
  data() {
    return {
      deviceTypes,
      states,
      form: {
        pkgName: '',
        state: '',
        deviceType: ''
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
