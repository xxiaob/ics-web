<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small" @submit.native.prevent>
      <el-form-item prop="areaTypeName" label="区域类型">
        <el-input v-model="form.areaTypeName" placeholder="请输入区域类型名称" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
export default {
  name: 'SystemAreaTypeFilter',
  data() {
    return {
      form: {
        areaTypeName: ''
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
