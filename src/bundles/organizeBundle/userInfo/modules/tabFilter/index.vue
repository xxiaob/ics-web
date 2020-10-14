<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="orgId" label="组织">
        <el-cascader :options="orgTree" v-model="form.orgId" :props="{expandTrigger: 'hover', checkStrictly: true,emitPath: false }" clearable @change="orgChange" ref="orgCascader"></el-cascader>
      </el-form-item>
      <el-form-item prop="positionId" label="职位">
        <el-select v-model="form.positionId" filterable placeholder="全部">
          <el-option v-for="item in positions" :key="item.positionId" :label="item.positionName" :value="item.positionId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="userInfo" label="用户信息">
        <el-input v-model="form.userInfo" placeholder="姓名或手机号"></el-input>
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

import { exportUserList } from '@/api/organizeInfo'
import { positionListAll } from '@/api/position'

export default {
  name: 'EventManageFilter',
  props: {
    orgTree: {
      type: Array
    },
    userIds: {
      type: Array
    }
  },
  data() {
    return {
      positions: [],
      loading: false,
      form: {
        userInfo: '',
        orgId: '',
        positionId: ''
      },
      orgId: ''
    }
  },
  created() {
    this.remoteMethod()
  },
  methods: {
    orgChange() {
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
    async remoteMethod() {
      this.loading = true
      try {
        this.positions = await positionListAll()
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },
    reset() {
      this.$refs.form.resetFields()
      this.form.orgId = ''
      this.form.userInfo = ''
      this.form.positionId = ''
    },
    onSubmit() {
      this.orgId = this.form.orgId
      this.$emit('filter', this.form)
    },
    exportData() {
      // 导出列表数据
      exportUserList({ userIds: this.userIds, orgId: this.orgId })
    }
  }
}
</script>
