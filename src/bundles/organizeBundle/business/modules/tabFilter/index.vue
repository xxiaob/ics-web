<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="projectId" label="项目名称">
        <el-cascader v-model="form.projectId" :options="projectList" :props="projectCascaderProps"></el-cascader>
      </el-form-item>

      <el-form-item label="时间尺度">
        <el-radio-group v-model="timeType">
          <el-radio-button  label="0">本周</el-radio-button>
          <el-radio-button  label="1">本月</el-radio-button>
          <el-radio-button  label="2">全年</el-radio-button>
          <el-radio-button  label="3">自定</el-radio-button>
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
        reportUserName: '',
        startDate: '',
        endDate: '',
        desc: '',
        orgId: '',
        eventType: '',
        projectId: ''
      },
      date: null,
      timeType: '0'
    }
  },
  watch: {
    data() {
      console.log('time', this.form)
    },
    timeType() {
      this.initDate()
    },
    projectList() {
      this.form.projectId = this.projectList[0].id
    }
  },
  created() {
    this.remoteMethod('')
    this.initDate()
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

      let startDate = '',
        endDate = ''

      if (timeType === '0') {
        // 根据周几判断离周一差几天
        if (day == 0) {
          ddate = ddate - 6
        } else {
          ddate = ddate - day + 1
        }

        // 获取开始结束时间
        startDate = new Date(year, month, ddate)
        endDate = new Date(year, month, ddate + 7)

        this.date = [startDate, endDate]
        this.form.startDate = startDate
        this.form.endDate = endDate
      } else if (timeType === '1') {
        // 获取开始结束时间
        startDate = new Date(year, month, 1)
        endDate = new Date(year, month + 1, 1)

        this.date = [startDate, endDate]
        this.form.startDate = startDate
        this.form.endDate = endDate
      } else if (timeType === '2') {
        // 获取开始结束时间
        startDate = new Date(year, 0, 1)
        endDate = new Date(year + 1, 0, 1)

        this.date = [startDate, endDate]
        this.form.startDate = startDate
        this.form.endDate = endDate
      }
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
      if (value) {
        this.form.startDate = new Date(value[0])
        this.form.endDate = new Date(value[1])
      } else {
        this.form.startDate = ''
        this.form.endDate = ''
      }

      console.log('this.form', this.form)
    },
    onSubmit() {
      console.log('this.form', this.form)
      this.$emit('filter', this.form)
    },
    exportData() {
      exportList(this.form)
    }
  }
}
</script>
