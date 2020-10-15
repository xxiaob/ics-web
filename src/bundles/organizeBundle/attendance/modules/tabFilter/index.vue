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

import { exportList } from '@/api/eventManage'

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
      loading: false,
      projectCascaderProps: {
        expandTrigger: 'hover',
        emitPath: false,
        children: 'sonProjects',
        label: 'name',
        value: 'id'
      },
      form: {
        projectId: null,
        startTime: '',
        endTime: '',
        type: 0
      },
      date: null,
      timeType: '0'
    }
  },
  watch: {
    timeType() {
      this.initDate()
      this.form.type = this.timeType
    },
    projectList() {
      this.form.projectId = this.projectList[0].id
    }
  },
  created() {
    this.initDate()

    this.$emit('filter', this.form)
  },
  methods: {
    initDate() {
      // 处理本周/本月/本年时间段
      let timeType = this.timeType

      // 获取时间
      let currentDate = new Date()

      let year = currentDate.getFullYear() // 年

      let month = currentDate.getMonth() // 月

      let ddate = currentDate.getDate() // 日

      let day = currentDate.getDay() // 周几

      let startTime = '', // 开始时间
        endTime = '' // 结束之间

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
    },
    orgChange() {
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
    changeDate(value) {
      if (value) {
        this.form.startTime = new Date(value[0])
        this.form.endTime = new Date(value[1])
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
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
