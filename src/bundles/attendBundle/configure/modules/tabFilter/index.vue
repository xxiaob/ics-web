<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" value-format="timestamp" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="orgId" label="所属组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false,checkStrictly:true }" clearable @change="orgChange" ref="orgCascader"></el-cascader>
      </el-form-item>
      <el-form-item prop="enabled" label="考勤状态">
        <el-select v-model="form.enabled" placeholder="请选择考勤状态">
          <el-option v-for="item in ATTEND_CONFIGURE_STATUSES.VALUES" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考勤名称" prop="attendanceName">
        <el-input v-model="form.attendanceName" placeholder="请输入考勤名称"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { ATTEND_CONFIGURE_STATUSES } from '@/constant/Dictionaries'

export default {
  name: 'ConfigureFilter',
  props: {
    userId: String,
    orgTree: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      ATTEND_CONFIGURE_STATUSES,
      form: {
        startDate: '',
        endDate: '',
        enabled: null,
        orgId: '',
        attendanceName: ''
      },
      date: null
    }
  },
  methods: {
    async orgChange(orgId) {
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
      this.form.startDate = ''
      this.form.endDate = ''
      this.date = null
    },
    onSubmit() {
      this.$emit('filter', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-status-group {
  margin-bottom: $jc-default-dis;
}
</style>
