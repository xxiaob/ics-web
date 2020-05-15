<template>
  <el-card class="jc-tabfilter-card">
    <div class="jc-status-group">
      <el-radio-group v-model="status" size="medium" @change="changeStatus">
        <el-radio-button v-for="(value,key) in selectTypes" :key="key" :label="key">{{value}}</el-radio-button>
      </el-radio-group>
    </div>
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="eventType" label="项目名称">
        <el-select v-model="form.eventType" placeholder="选择项目名称">
          <el-option v-for="(value,key) in eventTypes" :key="key" :label="value" :value="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="desc" label="任务描述">
        <el-input v-model="form.desc" placeholder="请输入任务描述"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { selectTypes } from '../../const'
export default {
  name: 'SystemTaskProcessFilter',
  data() {
    return {
      eventTypes: [],
      selectTypes,
      status: '0',
      form: {
        selectType: '0',
        projectId: '',
        projectType: '',
        startDate: '',
        endDate: '',
        desc: ''
      },
      date: null
    }
  },
  created() {

  },
  methods: {
    changeStatus(value) {
      // console.log(value)
      this.reset()
      this.form.selectType = value
      this.onSubmit()
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
      this.form.startDate = ''
      this.form.endDate = ''
      this.date = null
      this.form.selectType = this.status
    },
    onSubmit() {
      const form = {}

      Object.keys(this.form).forEach(key=>{
        if (this.form[key]) {
          form[key] = this.form[key]
        }
      })
      this.$emit('filter', form)
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-status-group {
  margin-bottom: $jc-default-dis;
}
</style>
