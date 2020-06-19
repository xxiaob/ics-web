<template>
  <el-card class="jc-tabfilter-card">
    <div class="jc-status-group" v-if="!self">
      <el-radio-group v-model="status" size="medium" @change="changeStatus">
        <el-radio-button v-for="item in ATTEND_PERIODS.VALUES" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
      </el-radio-group>
    </div>
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="orgId" label="所属组织" v-if="!self">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false,checkStrictly:true }" clearable @change="orgChange" ref="orgCascader"></el-cascader>
      </el-form-item>
      <el-form-item prop="" label="时间">
        <el-date-picker v-if="status===ATTEND_PERIODS.DAY" v-model="date" @change="changeDate" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <div v-if="status===ATTEND_PERIODS.WEEK">
          <el-date-picker v-model="form.startTime" value-format="yyyy-MM-dd" type="week" format="yyyy 第 WW 周" placeholder="开始周"></el-date-picker>
          <span>-</span>
          <el-date-picker v-model="endWeek" value-format="yyyy-MM-dd HH:mm:ss" type="week" format="yyyy 第 WW 周" placeholder="结束周" @change="changeEndWeek"></el-date-picker>
        </div>
        <el-date-picker v-if="status===ATTEND_PERIODS.MONTH" v-model="date" @change="changeDate" value-format="yyyy-MM" type="monthrange" range-separator="-" start-placeholder="开始月" end-placeholder="结束月">
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
import { ATTEND_PERIODS } from '@/constant/Dictionaries'
import { exportMyAttend, exportPeopleAttend, exportPostAttend } from '@/api/attend'
import moment from 'moment'

export default {
  name: 'AttendFilter',
  props: {
    userId: String,
    self: {
      type: Boolean,
      default: false
    },
    people: {
      type: Boolean,
      default: false
    },
    post: {
      type: Boolean,
      default: false
    },
    orgTree: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      ATTEND_PERIODS,
      status: ATTEND_PERIODS.DAY,
      form: {
        type: ATTEND_PERIODS.DAY,
        startTime: '',
        endTime: '',
        orgId: ''
      },
      date: null,
      endWeek: null
    }
  },
  methods: {
    orgChange() {
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
    changeStatus(value) {
      this.reset()
      this.form.type = value
      this.onSubmit()
    },
    changeDate(value) {
      if (value) {
        this.form.startTime = value[0]
        this.form.endTime = value[1]
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    },
    changeEndWeek(v) {
      const timeStamp = new Date(v).getTime() + 6 * 24 * 60 * 60 * 1000
      const endTime = moment(new Date(timeStamp)).format('YYYY-MM-DD')

      this.form.endTime = endTime
    },
    reset() {
      this.$refs.form.resetFields()
      this.form.startTime = ''
      this.form.endTime = ''
      this.date = null
      this.form.type = this.status
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
      console.log('exportData')
      if (this.self) {
        exportMyAttend({ userId: this.userId, ...this.form })
      }
      if (this.people) {
        exportPeopleAttend({ userId: this.userId, ...this.form })
      }
      if (this.post) {
        exportPostAttend({ userId: this.userId, ...this.form })
      }
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
.jc-status-group {
  margin-bottom: $jc-default-dis;
}
</style>
