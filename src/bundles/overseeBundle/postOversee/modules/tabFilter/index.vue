<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="orgId" label="所属组织" v-if="!self">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false,checkStrictly:true }" clearable></el-cascader>
      </el-form-item>
      <el-form-item prop="areaTypeId" label="岗点类型">
        <el-select v-model="form.areaTypeId" placeholder="请选择岗点类型">
          <el-option v-for="item in areaTypes" :key="item.areaTypeId" :label="item.areaTypeName" :value="item.areaTypeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="superviseType" label="督查结果">
        <el-select v-model="form.superviseType" placeholder="请选择督查结果">
          <el-option v-for="item in superviseTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="" label="时间">
        <el-date-picker v-model="date" @change="changeDate" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
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
import { areaTypeList } from '@/api/areaType'
import { ATTEND_OVERSEE_STATUSES } from '@/constant/Dictionaries'
import { exportPostOversee } from '@/api/attend'
export default {
  name: 'PostOverseeFilter',
  props: {
    self: {
      type: Boolean,
      default: false
    },
    orgTree: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      areaTypes: [],
      superviseTypes: ATTEND_OVERSEE_STATUSES.VALUES,
      form: {
        areaTypeId: '',
        superviseType: '',
        startTime: '',
        endTime: '',
        orgId: ''
      },
      date: null
    }
  },
  created() {
    this.getAreaTypeList()
  },
  methods: {
    async getAreaTypeList() {
      this.areaTypes = await areaTypeList({})
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
      this.form.startTime = ''
      this.form.endTime = ''
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
      console.log('exportData')
      exportPostOversee(this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-status-group {
  margin-bottom: $jc-default-dis;
}
</style>
