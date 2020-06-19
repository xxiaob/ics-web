<template>
  <el-card class="jc-tabfilter-card">
    <div class="jc-status-group">
      <el-radio-group v-model="status" size="medium" @change="changeStatus">
        <el-radio-button v-for="item in selectTypes" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
      </el-radio-group>
    </div>
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="projectId" label="项目名称">
        <el-cascader v-model="form.projectId" :options="projectList" :props="{expandTrigger:'hover',emitPath:false}"></el-cascader>
      </el-form-item>
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" value-format="timestamp" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="desc" label="任务信息">
        <el-input v-model="form.desc" placeholder="输入下发人或任务名称"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { TASK_SELECT_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'TaskProcessFilter',
  props: {
    projectList: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      selectTypes: TASK_SELECT_TYPES.VALUES,
      status: TASK_SELECT_TYPES.PENDING,
      form: {
        selectType: TASK_SELECT_TYPES.PENDING,
        projectId: '',
        // projectType: '',
        startDate: '',
        endDate: '',
        desc: ''
      },
      date: null
    }
  },
  methods: {
    changeStatus(value) {
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
