<template>
  <el-card class="jc-tabfilter-card">
    <div slot="header" class="jc-card-title">条件搜索</div>
    <el-form :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item label="审批人">
        <el-input v-model="form.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
export default {
  name: 'SystemRoleFilter',
  data() {
    return {
      form: {

      }
    }
  },
  methods: {
    onSubmit() {
      this.$emit('filter', this.form)
    }
  }
}
</script>
