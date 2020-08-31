<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small" @submit.native.prevent>
      <el-form-item prop="systemName" label="廉政信息">
        <el-input v-model="form.rollingMessage" placeholder="请输入廉政信息" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
      <el-form-item prop="" label="截止日期范围">
        <el-date-picker v-model="date" @change="changeDate" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-ddTHH:mm:ssZ">
        </el-date-picker>
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
  name: 'SystemBaseGovernmentFilter',
  data() {
    return {
      form: {
        rollingMessage: '',
        beginTime: '',
        endTime: ''
      },
      date: null
    }
  },
  methods: {
    changeDate(value) { // 时间切换
      if (value) {
        this.form.beginTime = value[0]
        this.form.endTime = value[1]
      } else {
        this.form.beginTime = ''
        this.form.endTime = ''
      }
    },
    reset() {
      this.$refs.form.resetFields()
      this.form.rollingMessage = ''
      this.form.beginTime = ''
      this.form.endTime = ''
      this.date = null
    },
    onSubmit() {
      this.$emit('filter', this.form)
    }
  }
}
</script>
