<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="orgId" label="所属组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', checkStrictly: true,emitPath: false }" clearable></el-cascader>
      </el-form-item>
      <el-form-item prop="eventType" label="事件类型">
        <el-select v-model="form.eventType" placeholder="选择事件类型">
          <el-option v-for="(value,key) in eventTypes" :key="key" :label="value" :value="key"></el-option>
        </el-select>
      </el-form-item>
      <!-- <br><br> -->
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="desc" label="事件描述">
        <el-input v-model="form.desc" placeholder="请输入事件描述"></el-input>
      </el-form-item>

      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { eventTypes } from '../../const'
export default {
  name: 'SystemEventManageFilter',
  props: {
    orgTree: {
      type: Array
    }
  },
  data() {
    return {
      eventTypes,
      form: {
        startDate: '',
        endDate: '',
        desc: '',
        orgId: '',
        eventType: ''
      },
      date: null
    }
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
      this.form.orgId = ''
      this.form.startDate = ''
      this.form.endDate = ''
      this.orgIds = []
      this.date = null
    },
    onSubmit() {
      this.$emit('filter', this.form)
    }
  }
}
</script>
