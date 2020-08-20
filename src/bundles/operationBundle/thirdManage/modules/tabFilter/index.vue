<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="thridName" label="第三方名称">
        <el-input v-model="form.thridName" placeholder="请输入第三方名称"></el-input>
      </el-form-item>
      <el-form-item prop="orgId" label="组织名称">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', checkStrictly: true,emitPath: false }" clearable @change="orgChange" ref="orgCascader"></el-cascader>
      </el-form-item>
      <el-form-item prop="" label="截止日期范围">
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

export default {
  name: 'OperationThirdManageFilter',
  props: {
    orgTree: {
      type: Array
    }
  },
  data() {
    return {
      form: {
        thridName: '',
        orgId: '',
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
        this.form.startTime = value[0].getTime()
        this.form.endTime = value[1].getTime()
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    },
    reset() { // 重置
      this.$refs.form.resetFields()
      this.form.orgId = ''
      this.form.startTime = ''
      this.form.endTime = ''
      this.date = null
    },
    onSubmit() { // 提交
      this.$emit('filter', this.form)
    }
  }
}
</script>
