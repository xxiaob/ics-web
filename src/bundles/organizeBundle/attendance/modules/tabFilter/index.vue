<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="eventType" label="项目名称">
        <el-select v-model="form.eventType" filterable placeholder="请选择事件类型">
          <el-option v-for="item in eventTypes" :key="item.id" :label="item.typeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="时间尺度">
        <el-radio-group v-model="time">
          <el-radio-button  label="week">本周</el-radio-button>
          <el-radio-button  label="month">本月</el-radio-button>
          <el-radio-button  label="year">全年</el-radio-button>
          <el-radio-button  label="custom">自定义</el-radio-button>
        </el-radio-group>
         <el-date-picker v-model="date" :disabled="time !=='custom'" @change="changeDate" value-format="timestamp" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
// import { PROJECT_TYPES } from '@/constant/Dictionaries'

import { eventManageTypeList, exportList } from '@/api/eventManage'
export default {
  name: 'EventManageFilter',
  props: {
    orgTree: {
      type: Array
    }
  },
  data() {
    return {
      eventTypes: [],
      loading: false,
      form: {
        reportUserName: '',
        startDate: '',
        endDate: '',
        desc: '',
        orgId: '',
        eventType: ''
      },
      date: null,
      time: 'week'
    }
  },
  watch: {
    time() {
      console.log('time', this.time)
    }
  },
  created() {
    this.remoteMethod('')
  },
  methods: {
    orgChange() {
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
    async remoteMethod(query) {
      this.loading = true
      try {
        this.eventTypes = await eventManageTypeList(query)
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },
    changeDate(value) {
      console.log('value', value)
      console.log('date', this.date)
      if (value) {
        this.form.startDate = value[0]
        this.form.endDate = value[1]
      } else {
        this.form.startDate = ''
        this.form.endDate = ''
      }
    },
    reset() {
      this.$refs.form.resetFields()
      this.form.orgId = ''
      this.form.startDate = ''
      this.form.endDate = ''
      this.orgIds = []
      this.date = null
    },
    onSubmit() {
      this.$emit('filter', this.form)
    },
    exportData() {
      exportList(this.form)
    }
  }
}
</script>
