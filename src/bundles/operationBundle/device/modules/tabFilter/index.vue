<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="orgId" label="所属组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false,checkStrictly:true }" clearable @change="orgChange" ref="orgCascader"></el-cascader>
      </el-form-item>
      <el-form-item prop="deviceType" label="设备类型">
        <el-select v-model="form.deviceType" placeholder="设备类型">
          <el-option v-for="item in deviceTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="source" label="设备来源">
        <el-select v-model="form.source" placeholder="设备来源">
          <el-option v-for="item in deviceSources" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="deviceName" label="设备名称">
        <el-input v-model="form.deviceName" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { DEVICE_TYPES, DEVICE_SOURCES } from '@/constant/Dictionaries'
export default {
  props: {
    orgTree: {
      type: Array,
      default: ()=>[]
    }
  },
  name: 'SystemDeviceFilter',
  data() {
    return {
      deviceTypes: DEVICE_TYPES.VALUES,
      deviceSources: DEVICE_SOURCES.VALUES,
      form: {
        deviceType: '',
        deviceName: '',
        orgId: '',
        source: DEVICE_SOURCES.HANKER
      }
    }
  },
  created() {
    this.onSubmit()
  },
  methods: {
    orgChange() {
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
    reset() {
      this.$refs.form.resetFields()
    },
    onSubmit() {
      this.$emit('filter', this.form)
    }
  }
}
</script>
