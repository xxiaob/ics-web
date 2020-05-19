<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="eventType" label="项目名称">
        <el-select v-model="form.eventType" placeholder="选择项目名称">
          <el-option v-for="(value,key) in eventTypes" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <el-select v-model="form.eventType" placeholder="选择项目名称">
          <el-option v-for="(value,key) in eventTypes" :key="key" :label="value" :value="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="orgId" label="所属组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false }" clearable></el-cascader>
      </el-form-item>
      <el-form-item prop="state" label="任务状态">
        <el-select v-model="form.state" placeholder="选择任务状态">
          <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="desc" label="任务描述">
        <el-input v-model="form.desc" placeholder="请输入任务描述"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { TASK_STATES } from '@/constant/Dictionaries'
export default {
  name: 'SystemTaskProcessFilter',
  props: {
    orgTree: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      eventTypes: [],
      states: TASK_STATES.VALUES,
      form: {
        projectId: '',
        projectType: '',
        orgId: '',
        startDate: '',
        endDate: '',
        desc: '',
        state: ''
      },
      date: null
    }
  },
  created() {

  },
  methods: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
