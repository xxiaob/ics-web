<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">

      <el-form-item prop="desc" label="告警信息">
        <el-input v-model="form.address" placeholder="请输入告警信息"></el-input>
      </el-form-item>
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
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
  name: 'alarmManageFilter',
  props: {
    orgTree: {
      type: Array
    }
  },
  data() {
    return {
      loading: false,
      form: {
        startTime: '',
        endTime: '',
        address: ''
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
      this.form.address = ''
      this.date = null
    },
    onSubmit() {
      this.$emit('filter', this.form)
    }
  }
}
</script>
