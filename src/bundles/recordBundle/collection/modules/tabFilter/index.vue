<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="orgId" label="所属组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', checkStrictly: true,emitPath: false }" clearable @change="orgChange" ref="orgCascader"></el-cascader>
      </el-form-item>
      <el-form-item prop="capturePerson" label="采集人员">
        <el-input v-model="form.capturePerson" placeholder="请输入采集人员"></el-input>
      </el-form-item>
      <el-form-item prop="" label="时间">
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
  name: 'RecordCollectionFilter',
  props: {
    orgTree: {
      type: Array
    }
  },
  data() {
    return {
      loading: false,
      form: {
        startTime: '',
        endTime: '',
        capturePerson: '',
        orgId: ''
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
        this.form.startTime = value[0]
        this.form.endTime = value[1]
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    },
    reset() {
      this.$refs.form.resetFields()
      this.form.orgId = ''
      this.form.startTime = ''
      this.form.endTime = ''
      this.date = null
    },
    onSubmit() {
      this.$emit('filter', this.form)
    }
  }
}
</script>
