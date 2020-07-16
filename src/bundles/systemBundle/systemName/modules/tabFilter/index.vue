<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small" @submit.native.prevent>
      <el-form-item prop="domain" label="域名">
        <el-input v-model="form.domain" placeholder="请输入域名" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
      <el-form-item prop="systemName" label="系统名称">
        <el-input v-model="form.systemName" placeholder="请输入系统名称" @keyup.enter.native="onSubmit"></el-input>
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
  name: 'SystemNameFilter',
  data() {
    return {
      form: {
        domain: '',
        systemName: ''
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    onSubmit() {
      const form = {}

      Object.keys(this.form).forEach(key=>{
        if (this.form[key]) {
          form[key] = this.form[key]
        }
      })
      this.$emit('filter', form)
    }
  }
}
</script>
