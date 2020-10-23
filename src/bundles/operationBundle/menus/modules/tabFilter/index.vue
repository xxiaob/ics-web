<template>
  <el-card class="jc-tabfilter-card">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small" @submit.native.prevent>
      <el-form-item prop="type" label="菜单类型">
        <el-select v-model="form.type" placeholder="请选择菜单类型">
          <el-option
            v-for="item in menuType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="菜单名称">
        <el-input v-model="form.name" placeholder="请输入菜单名称" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
export default {
  name: 'SystemMenusFilter',
  data() {
    return {
      form: {
        name: '',
        type: '1'
      },
      menuType: [
        {
          label: 'PC端',
          value: '1'
        },
        {
          label: 'APP端',
          value: '2'
        }
      ]
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    onSubmit() {
      this.$emit('filter', this.form)
    }
  }
}
</script>
