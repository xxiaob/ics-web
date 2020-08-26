<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="thridName" label="告警类型">
        <el-input v-model="form.thirdPartyName" placeholder="请输入第三方名称"></el-input>
      </el-form-item>
      <el-form-item prop="orgName" label="状态">
        <!-- <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', checkStrictly: true,emitPath: false }" clearable @change="orgChange" ref="orgCascader"></el-cascader> -->
        <el-input v-model="form.orgName" placeholder="请输入组织名称"></el-input>
      </el-form-item>
      <el-form-item prop="" label="事件">
        <el-date-picker v-model="date" @change="changeDate" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="orgName" label="告警信息">
        <el-input v-model="form.orgName" placeholder="输入企业名称或车牌号"></el-input>
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

export default {
  name: 'OperationThirdManageFilter',
  data() {
    return {
      form: {
        thirdPartyName: '',
        orgName: '',
        startTime: '',
        endTime: ''
      },
      date: null
    }
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
      this.form.thirdPartyName = ''
      this.form.orgName = ''
      this.form.startTime = ''
      this.form.endTime = ''
      this.date = null
    },
    onSubmit() { // 提交
      this.$emit('filter', this.form) // 查询信息
    }
  }
}
</script>
