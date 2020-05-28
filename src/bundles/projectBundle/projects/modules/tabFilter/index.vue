<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="projectName" label="项目名称">
        <el-input v-model="form.projectName" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item prop="date" label="项目时间">
        <el-date-picker v-model="form.date" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="status" label="项目状态">
        <el-select v-model="form.status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in projectStatus" :key="item.key" :label="item.label" :value="item.value"></el-option>
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
import { PROJECT_STATUS } from '@/constant/Dictionaries'
export default {
  name: 'ProjectProjectsFilter',
  data() {
    return {
      projectStatus: PROJECT_STATUS.VALUES,
      form: {
        date: '',
        status: '',
        projectName: ''
      }
    }
  },
  watch: {
    '$route'() {
      this.reset()
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    onSubmit() {
      this.$emit('filter', { ...this.form, ...(this.form.date.length ? { beginTime: this.form.date[0], endTime: this.form.date[1] } : {}) })
    }
  }
}
</script>
