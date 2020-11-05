<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="orgId" label="组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', checkStrictly: true,emitPath: false }" clearable @change="orgChange" ref="orgCascader"></el-cascader>
      </el-form-item>
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate"  type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item prop="eventType" label="告警来源">
        <el-select v-model="form.eventType" filterable placeholder="请选择">
          <el-option v-for="item in eventTypes" :key="item.id" :label="item.typeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="desc" label="相关人员">
        <el-input v-model="form.desc" placeholder="请输入相关人员"></el-input>
      </el-form-item>
      <el-form-item prop="state" label="告警状态">
        <el-select v-model="form.alarmType" filterable placeholder="请选择">
          <el-option v-for="item in alarmTypes" :key="item.id" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
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
import { exportList } from '@/api/eventManage'

import { SYSTEM_ALARM_STATUS } from '@/constant/Dictionaries'
console.log('SYSTEM_ALARM_STATUS', SYSTEM_ALARM_STATUS.VALUES)
export default {
  name: 'EventManageFilter',
  props: {
    orgTree: {
      type: Array
    }
  },
  data() {
    return {
      alarmTypes: SYSTEM_ALARM_STATUS.VALUES,
      loading: false,
      form: {
        reportUserName: '',
        startDate: '',
        endDate: '',
        desc: '',
        orgId: '',
        alarmType: '',
        state: ''
      },
      date: null
    }
  },
  created() {
    // this.remoteMethod('')
  },
  methods: {
    orgChange() {
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
    // async remoteMethod(query) {
    //   this.loading = true
    //   try {
    //     this.loading = false
    //   } catch (error) {
    //     console.error(error)
    //     this.loading = false
    //   }
    // },
    changeDate(value) {
      console.log('value', value)
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
      console.log('this.form', this.form)
      this.$emit('filter', this.form)
    },
    exportData() {
      exportList(this.form)
    }
  }
}
</script>
