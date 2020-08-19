<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <slot name="back"></slot>
      <el-form-item label="设备名称">
        <span>{{detail.deviceName}}</span>
      </el-form-item>
      <el-form-item label="位置信息">
        <span>{{detail.positionName}}</span>
      </el-form-item>
      <el-form-item label="时间" prop="startTime" :rules="rules.SELECT_NOT_NULL">
        <el-date-picker v-model="date" @change="changeDate" value-format="timestamp" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
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
import moment from 'moment'
import { SELECT_NOT_NULL } from '@/libs/rules'

export default {
  name: 'SystemDeviceVideoFilter',
  props: {
    detail: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      rules: {
        SELECT_NOT_NULL
      },
      today: new Date(moment().format('YYYY-MM-DD') + ' 00:00:00').getTime(), // 初始时间
      form: {
        startTime: '',
        endTime: ''
      },
      date: null
    }
  },
  created() {
    this.form.startTime = this.today // 开始时间
    this.form.endTime = this.today + 24 * 60 * 60 * 1000 // 结束时间
    this.date = [this.form.startTime, this.form.endTime]
    this.$emit('filter', this.form)
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
      this.date = null
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log('filter', this.form)
          this.$emit('filter', this.form)
        }
      })
    }
  }
}
</script>
