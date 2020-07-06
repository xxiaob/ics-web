<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="orgId" label="所属组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false,checkStrictly:true }" clearable @change="orgChange" ref="orgCascader"></el-cascader>
      </el-form-item>
      <el-form-item prop="postAreaId" label="考勤状态">
        <el-select v-model="form.postAreaId" placeholder="请选择考勤状态">
          <el-option v-for="item in postAreas" :key="item.areaId" :label="item.areaName" :value="item.areaId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考勤名称" prop="eventTitle">
        <el-input v-model="form.name" placeholder="请输入考勤名称"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { postArea } from '@/api/task'
// import moment from 'moment'

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
      postAreas: [],
      form: {
        userId: this.userId,
        startTime: '',
        endTime: '',
        orgId: '',
        postAreaId: ''
      },
      date: null
    }
  },
  methods: {
    async orgChange(orgId) {
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框

      if (orgId) {
        this.postAreas = await postArea({ orgId })
      } else {
        this.postAreas = []
      }
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
    reset() {
      this.$refs.form.resetFields()
      this.form.startTime = ''
      this.form.endTime = ''
      this.date = null
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
