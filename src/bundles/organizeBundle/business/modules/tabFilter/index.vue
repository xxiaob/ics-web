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

import { projectsTreeList } from '@/api/projects'
import { PROJECT_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'OrganizeBusinessFilter',
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
        beginTim: '',
        endTime: '',
        projectId: ''
      },
      date: null,
      timeType: '0',
      projectList: [],
      projectObj: {},
      EmergencySupport: []
    }
  },
  watch: {
    timeType() {
      this.initDate()
    }
  },
  async created() {
    this.initDate()
    await this.getProjects()
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

      let beginTim = '',
        endTime = ''

      if (timeType === '0') {
        // 根据周几判断离周一差几天
        if (day == 0) {
          ddate = ddate - 6
        } else {
          ddate = ddate - day + 1
        }

        // 获取开始结束时间
        beginTim = new Date(year, month, ddate)
        endTime = new Date(year, month, ddate + 7)

        this.date = [beginTim, endTime]
        this.form.beginTim = beginTim
        this.form.endTime = endTime
      } else if (timeType === '1') {
        // 获取开始结束时间
        beginTim = new Date(year, month, 1)
        endTime = new Date(year, month + 1, 1)

        this.date = [beginTim, endTime]
        this.form.beginTim = beginTim
        this.form.endTime = endTime
      } else if (timeType === '2') {
        // 获取开始结束时间
        beginTim = new Date(year, 0, 1)
        endTime = new Date(year + 1, 0, 1)

        this.date = [beginTim, endTime]
        this.form.beginTim = beginTim
        this.form.endTime = endTime
      }
    },
    orgChange() {
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
    formatProject(row, column, cellValue) {
      return this.projectObj[cellValue]
    },
    async getProjects() {
      const res = await projectsTreeList()

      this.projectList = res
      this.form.projectId = this.projectList[0].id
      this.projectObj = this.formatProjectTreeToObj(res)
    },
    formatProjectTreeToObj(child) {
      let objs = {}

      if (child && child.length) {
        child.forEach(item => {
          if (item.sonProjects && item.sonProjects.length) {
            objs = Object.assign(objs, this.formatProjectTreeToObj(item.sonProjects))
          }
          objs[item.id] = item.name

          //应急项目
          if (item.type == PROJECT_TYPES.EmergencySupport) {
            this.EmergencySupport.push(item)
          }
        })
      }
      return objs
    },
    changeDate(value) {
      if (value) {
        this.form.beginTim = new Date(value[0])
        this.form.endTime = new Date(value[1])
      } else {
        this.form.beginTim = ''
        this.form.endTime = ''
      }
    },
    onSubmit() {
      this.$emit('filter', this.form)
    },
    exportData() {
      // exportList(this.form)
    }
  }
}
</script>
