<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="lawsType" label="法规类型">
        <el-select v-model="form.lawsType" placeholder="选择法规类型">
          <el-option v-for="item in types" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="lawsTime" label="事件">
        <el-date-picker v-model="date" @change="changeDate" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="lawsInfo" label="法规信息">
        <el-input v-model="form.lawsInfo" placeholder="请输入法规名称或创建人姓名"></el-input>
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
    types: {
      type: Array,
      default: [
        {
          id: 1,
          typeName: '国家法律'
        },
        {
          id: 2,
          typeName: '行政法规'
        },
        {
          id: 3,
          typeName: '地方性法规'
        },
        {
          id: 4,
          typeName: '政府规章'
        },
        {
          id: 5,
          typeName: '其他'
        }
      ]
    },
    orgTree: {
      type: Array
    }
  },
  data() {
    return {
      form: {
        lawsType: '',
        startTime: '',
        endTime: '',
        lawsInfo: ''
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
      console.log('this.form', this.form)
      this.$emit('filter', this.form) // 查询信息
    },
    addHandle() {
      this.$emit('addopeartion')
    }
  }
}
</script>
