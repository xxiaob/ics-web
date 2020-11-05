<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="orgId" label="组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', checkStrictly: true,emitPath: false }" clearable @change="orgChange" ref="orgCascader"></el-cascader>
      </el-form-item>
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate"  type="datetimerange"  value-format="yyyy-MM-ddTHH:mm:ss.000Z" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item prop="alarmType" label="告警来源">
        <el-select v-model="form.alarmSourceType" filterable placeholder="请选择">
          <el-option v-for="item in alarmSourceTypes" :key="item.id" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="desc" label="相关人员">
        <el-input v-model="form.desc" placeholder="请输入相关人员"></el-input>
      </el-form-item>
      <el-form-item prop="alarmState" label="告警状态">
        <el-select v-model="form.alarmStatus" filterable placeholder="请选择">
          <el-option v-for="item in alarmStates" :key="item.id" :label="item.label" :value="item.value">
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

import { SYSTEM_ALARM_STATUS, WARNING_TYPE } from '@/constant/Dictionaries'

export default {
  name: 'EventManageFilter',
  props: {
    orgTree: {
      type: Array
    }
  },
  data() {
    return {
      alarmStates: SYSTEM_ALARM_STATUS.VALUES,
      alarmSourceTypes: WARNING_TYPE.VALUES,
      loading: false,
      form: {
        startDate: '',
        endDate: '',
        desc: '',
        orgId: '',
        alarmStatus: '',
        alarmSourceType: ''
      },
      date: null
    }
  },

  methods: {
    orgChange() {
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },

    changeDate(value) {
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
      this.form.desc = ''
      this.form.alarmStatus = ''
      this.form.alarmSourceType = ''
      this.date = null
    },
    onSubmit() {
      console.log('this.form', this.form)
      this.$emit('filter', this.form)
    },
    exportData() {
      // exportList(this.form)
    }
  }
}
</script>
