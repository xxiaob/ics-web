<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="statuteType" label="法规类型">
        <el-select v-model="form.statuteType" placeholder="选择法规类型">
          <el-option v-for="item in types" :key="item.id" :label="item.configName" :value="item.configValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="desc" label="法规信息">
        <el-input v-model="form.desc" placeholder="请输入法规名称或创建人姓名"></el-input>
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
      default() {
        return []
      }
    }
  },
  data() {
    return {
      form: {
        statuteType: '',
        startDate: '',
        endDate: '',
        desc: ''
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
        this.form.startDate = value[0]
        this.form.endDate = value[1]
      } else {
        this.form.startDate = ''
        this.form.endDate = ''
      }
    },
    reset() { // 重置
      this.$refs.form.resetFields()
      this.form.statuteType = ''
      this.form.startDate = ''
      this.form.desc = ''
      this.form.endDate = ''
      this.date = null
    },
    onSubmit() { // 提交
      this.$emit('filter', this.form) // 查询信息
    }

  }
}
</script>
