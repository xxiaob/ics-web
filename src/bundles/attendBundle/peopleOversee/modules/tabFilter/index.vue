<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="orgId" label="所属组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false,checkStrictly:true }" clearable></el-cascader>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item prop="overseeResult" label="督查结果">
        <el-select v-model="form.overseeResult" placeholder="请选择督查结果">
          <el-option v-for="item in overseeResults" :key="item.id" :label="item.typeName" :value="item.id">
          </el-option>
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
      overseeResults: [],
      form: {
        name: '',
        orgId: '',
        overseeResult: ''
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
    },
    exportData() {
      console.log('exportData')
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-status-group {
  margin-bottom: $jc-default-dis;
}
</style>
