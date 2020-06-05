<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small">
      <el-form-item prop="positionId" label="职位">
        <el-select v-model="form.positionId" placeholder="职位">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in positions" :key="item.positionId" :label="item.positionName" :value="item.positionId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="userInfo" label="用户信息">
        <el-input v-model="form.userInfo" placeholder="用户名称/手机号"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { positionListAll } from '@/api/position'

export default {
  name: 'SystemUserFilter',
  data() {
    return {
      positions: [],
      form: {
        positionId: '',
        userInfo: ''
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      positionListAll().then(res => {
        let list = []

        if (res && res.length) {
          res.forEach(item => {
            list.push({ positionId: item.positionId, positionName: item.positionName })
          })
        }
        this.positions = list
      })
    },
    reset() {
      this.$refs.form.resetFields()
    },
    onSubmit() {
      this.$emit('filter', this.form)
    }
  }
}
</script>
