<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="orgId" label="所属组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false,checkStrictly:true }" clearable></el-cascader>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item prop="superviseType" label="督查结果">
        <el-select v-model="form.superviseType" placeholder="请选择督查结果">
          <el-option v-for="item in superviseTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
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
import { ATTEND_OVERSEE_STATUSES } from '@/constant/Dictionaries'
import { exportUserOversee } from '@/api/attend'

export default {
  name: 'PeopleOverseeFilter',
  props: {
    orgTree: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      superviseTypes: ATTEND_OVERSEE_STATUSES.VALUES,
      form: {
        name: '',
        orgId: '',
        superviseType: ''
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
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
      exportUserOversee(this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-status-group {
  margin-bottom: $jc-default-dis;
}
</style>
