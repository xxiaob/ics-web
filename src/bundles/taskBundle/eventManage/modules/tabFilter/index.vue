<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="orgId" label="所属组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', checkStrictly: true,emitPath: false }" clearable @change="orgChange" ref="orgCascader"></el-cascader>
      </el-form-item>
      <el-form-item prop="eventType" label="事件类型">
        <el-select v-model="form.eventType" filterable placeholder="请选择事件类型">
          <el-option v-for="item in eventTypes" :key="item.id" :label="item.typeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="reportUserName" label="上报人员">
        <el-input v-model="form.reportUserName" placeholder="请输入上报人员"></el-input>
      </el-form-item>
      <el-form-item prop="desc" label="事件描述">
        <el-input v-model="form.desc" placeholder="请输入事件描述"></el-input>
      </el-form-item>
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" value-format="timestamp" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
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
import { eventManageTypeList, exportList } from '@/api/eventManage'
export default {
  name: 'EventManageFilter',
  props: {
    orgTree: {
      type: Array
    }
  },
  data() {
    return {
      eventTypes: [],
      loading: false,
      form: {
        reportUserName: '',
        startDate: '',
        endDate: '',
        desc: '',
        orgId: '',
        eventType: ''
      },
      date: null
    }
  },
  created() {
    this.remoteMethod('')
  },
  methods: {
    orgChange() {
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
    async remoteMethod(query) {
      this.loading = true
      try {
        this.eventTypes = await eventManageTypeList(query)
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
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
      this.orgIds = []
      this.date = null
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
