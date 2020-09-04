<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="pkgName" label="应用名称">
        <el-input v-model="form.pkgName" placeholder="请输入应用名称"></el-input>
      </el-form-item>
      <el-form-item label="设备型号" prop="modelId">
        <el-select v-model="form.modelId" placeholder="选择设备型号">
          <el-option v-for="item in models" :key="item.modelId" :label="item.description" :value="item.modelId"></el-option>
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
import { states } from '../../const'
export default {
  props: {
    models: {
      type: Array,
      default: ()=>[]
    }
  },
  name: 'SystemDeviceUpdateFilter',
  data() {
    return {
      states,
      form: {
        pkgName: '',
        state: '',
        modelId: ''
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
