<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="positionId" label="项目名称">
        <el-cascader v-model="form.projectId" :options="projectList" :props="projectCascaderProps"></el-cascader>
      </el-form-item>

      <el-form-item label="时间尺度">
        <el-radio-group v-model="timeType">
          <el-radio-button  label="0">本周</el-radio-button>
          <el-radio-button  label="1">本月</el-radio-button>
          <el-radio-button  label="2">全年</el-radio-button>
          <el-radio-button  label="3">自定义</el-radio-button>
        </el-radio-group>
         <el-date-picker v-model="date" :disabled="timeType !=='3'" @change="changeDate" value-format="timestamp" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
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
    projectList: {
      type: Array,
      default: ()=>[]
    },
    orgTree: {
      type: Array
    }
  },
  data() {
    return {
      eventTypes: [],
      loading: false,
      projectCascaderProps: {
        expandTrigger: 'hover',
        emitPath: false,
        children: 'sonProjects',
        label: 'name',
        value: 'id'
      },
      form: {
        projectId: '',
        startTime: '',
        endTime: '',
        type: 0
      },
      date: null,
      timeType: '0'
    }
  },
  watch: {
    time() {
      console.log('time', this.time)
    },
    timeType() {
      this.initDate()
      this.form.type = this.timeType
    },
    projectList() {
      this.form.projectId = this.projectList[0].id
    }
  },
  created() {
    this.remoteMethod('')
    this.initDate()

    this.$emit('filter', this.form)
  },
  methods: {
    initDate() {
      let timeType = this.timeType

      let currentDate = new Date()
      // 获取时间

      let year = currentDate.getFullYear()

      let month = currentDate.getMonth()

      let ddate = currentDate.getDate()

      let day = currentDate.getDay()

      let startTime = '',
        endTime = ''

      if (timeType === '0') {
        // 根据周几判断离周一差几天
        if (day == 0) {
          ddate = ddate - 6
        } else {
          ddate = ddate - day + 1
        }

        // 获取开始结束时间
        startTime = new Date(year, month, ddate)
        endTime = new Date(year, month, ddate + 7)

        this.date = [startTime, endTime]
        this.form.startTime = startTime
        this.form.endTime = endTime
      } else if (timeType === '1') {
        // 获取开始结束时间
        startTime = new Date(year, month, 1)
        endTime = new Date(year, month + 1, 1)

        this.date = [startTime, endTime]
        this.form.startTime = startTime
        this.form.endTime = endTime
      } else if (timeType === '2') {
        // 获取开始结束时间
        startTime = new Date(year, 0, 1)
        endTime = new Date(year + 1, 0, 1)

        this.date = [startTime, endTime]
        this.form.startTime = startTime
        this.form.endTime = endTime
      }
      console.log('this.form', this.form)
    },
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
        this.form.startTime = value[0]
        this.form.endTime = value[1]
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    },
    reset() {
      this.$refs.form.resetFields()
      this.form.orgId = ''
      this.form.startTime = ''
      this.form.endTime = ''
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
