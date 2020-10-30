<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="orgId" label="所属组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false,checkStrictly:true }" clearable @change="orgChange" ref="orgCascader"></el-cascader>
      </el-form-item>
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
        <el-button type="primary" @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { exportList } from '@/api/question'
import { QUESTION_SOURCES } from '@/constant/Dictionaries'
import OrgTreeMixins from '@/mixins/OrgTreeMixins'

export default {
  name: 'TaskQuestionProcessFilter',
  mixins: [ OrgTreeMixins],
  props: {
    types: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      QUESTION_SOURCES,
      problemTypeArr: [],
      form: {
        problemType: '',
        problemBigTypeName: '',
        startDate: '',
        endDate: '',
        problemDesc: '',
        orgId: '',
        problemSource: ''
      },
      date: null
    }
  },
  created() {
    this.getOrgTree()
  },
  methods: {
    typeChange(v) {
      // console.log('typeChange', v)
      this.form.problemBigTypeName = v[0]
      this.form.problemType = v[1]
      this.$refs.typeCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
    orgChange() {
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
      const form = {}

      Object.keys(this.form).forEach(key=>{
        if (this.form[key]) {
          form[key] = this.form[key]
        }
      })
      this.$emit('filter', form)
    },
    exportData() {
      console.log('question exportList')
      exportList(this.form)
    }
  }
}
</script>
