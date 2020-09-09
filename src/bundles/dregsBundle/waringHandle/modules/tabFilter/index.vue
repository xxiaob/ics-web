<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="subTypeCode" label="告警类型">
        <el-select v-model="form.subTypeCode" placeholder="选择告警类型">
          <el-option v-for="item in types" :key="item.id" :label="item.configName" :value="item.configValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-select v-model="form.status" placeholder="选择状态">
          <el-option v-for="item in statuses" :key="item.id" :label="item.configName" :value="item.configValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="desc" label="告警信息">
        <el-input v-model="form.desc" placeholder="输入企业名称或车牌号"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { formatDate } from '@/libs/util'
import { getStatus } from '@/api/dregsAlarm'

export default {
  name: 'dregsWaringHandleIndexFilter',
  props: {
    types: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        subTypeCode: '',
        desc: '',
        startTime: '',
        endTime: '',
        status: ''
      },
      statuses: [],
      date: null
    }
  },
  async created() {
    this.statuses = await getStatus()
  },
  methods: {
    changeDate(value) { // 时间切换
      console.log('value', value)
      console.log('date', this.date)
      if (value) {
        this.form.startTime = formatDate(value[0])
        this.form.endTime = formatDate(value[1])
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    },
    reset() { // 重置
      this.$refs.form.resetFields()
      this.form.subTypeCode = ''
      this.form.desc = ''
      this.form.startTime = ''
      this.form.endTime = ''
      this.date = null
    },
    onSubmit() { // 提交
      console.log('this.form', this.form)
      this.$emit('filter', this.form) // 查询信息
    }
  }
}
</script>
