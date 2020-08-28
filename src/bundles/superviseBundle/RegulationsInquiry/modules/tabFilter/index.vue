<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="statuteType" label="条例类型">
        <el-select v-model="form.powerType" placeholder="选择条例类型">
          <el-option v-for="item in types" :key="item.id" :label="item.configName" :value="item.configValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="powerName" label="权利名称常用">
        <el-input v-model="form.powerName" placeholder="请输入常用权利名称"></el-input>
      </el-form-item>
      <el-form-item prop="powerGist" label="设定依据">
        <el-input v-model="form.powerGist" placeholder="请输入设定依据"></el-input>
      </el-form-item>
      <el-form-item prop="lawsTime" label="时间">
        <el-date-picker v-model="date" @change="changeDate" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
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
import { formatDate } from '@/libs/util'
export default {
  name: 'OperationThirdManageFilter',
  props: {
    types: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        powerType: '',
        powerName: '',
        powerGist: '',
        startTime: '',
        endTime: ''
      },
      date: null
    }
  },
  methods: {
    orgChange() {
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
    changeDate(value) { // 时间切换
      console.log('value', value)
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
      this.form.powerType = ''
      this.form.powerName = ''
      this.form.powerGist = ''
      this.form.startTime = ''
      this.form.endTime = ''
      this.form.desc = ''
      this.date = null
    },
    onSubmit() { // 提交
      this.$emit('filter', this.form) // 查询信息
    }
  }
}
</script>
