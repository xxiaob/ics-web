<template>
  <el-card class="jc-tabfilter-card">
    <div class="jc-status-group">
      <el-radio-group v-model="status" size="medium" @change="changeStatus">
        <el-radio-button v-for="item in selectTypes" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
      </el-radio-group>
      <slot name="manage"></slot>
    </div>
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item label="问题类型">
        <el-cascader :options="types" v-model="problemTypeArr" :props="{expandTrigger: 'hover', checkStrictly:true }" clearable @change="typeChange" ref="typeCascader"></el-cascader>
      </el-form-item>
      <el-form-item prop="problemSource" label="问题来源">
        <el-select v-model="form.problemSource" placeholder="选择问题来源">
          <el-option v-for="item in QUESTION_SOURCES.VALUES" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" value-format="timestamp" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="problemDesc" label="问题信息">
        <el-input v-model="form.problemDesc" placeholder="输入标题或反馈人"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { QUESTION_TYPES, QUESTION_SOURCES } from '@/constant/Dictionaries'
export default {
  name: 'QuestionProcessFilter',
  props: {
    types: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      QUESTION_SOURCES,
      selectTypes: QUESTION_TYPES.VALUES,
      status: QUESTION_TYPES.PENDING,
      problemTypeArr: [],
      form: {
        selectType: QUESTION_TYPES.PENDING,
        problemType: '',
        problemBigTypeName: '',
        startDate: '',
        endDate: '',
        problemDesc: '',
        problemSource: ''
      },
      date: null
    }
  },
  methods: {
    typeChange(v) {
      // console.log('typeChange', v)
      this.form.problemBigTypeName = v[0]
      this.form.problemType = v[1]
      this.$refs.typeCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
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
