<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { exportMyAttend } from '@/api/attend'

export default {
  name: 'MyAttendFilter',
  props: {
    userId: String,
    orgTree: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      form: {
        startTime: '',
        endTime: ''
      },
      date: null
    }
  },
  methods: {
    changeDate(value) {
      if (value) {
        this.form.startTime = value[0]
        this.form.endTime = value[1]
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    },
    reset() {
      this.$refs.form.resetFields()
      this.form.startTime = ''
      this.form.endTime = ''
      this.date = null
    },
    onSubmit() {
      const form = {}

      Object.keys(this.form).forEach(key=>{
        if (this.form[key]) {
          form[key] = this.form[key]
        }
      })
      this.$emit('filter', form)
    },
    exportData() {
      console.log('exportData myAttend')
      exportMyAttend({ userId: this.userId, ...this.form })
    },
    download(content) {
      const blob = new Blob([content])
      const url = URL.createObjectURL(blob)

      console.log(url)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
