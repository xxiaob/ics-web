<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="groupName" label="群组名称">
        <el-input v-model="form.groupName" placeholder="请输入群组名称"></el-input>
      </el-form-item>
      <el-form-item prop="userName" label="用户名称">
        <el-input v-model="form.userName" placeholder="请输入用户名称"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询群组</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
export default {
  name: 'SystemPttGroupFilter',
  data() {
    return {
      form: {
        groupName: '',
        userName: ''
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
<style lang="scss" scoped>
.jc-tabfilter-card {
  height: 75px;
}
</style>
