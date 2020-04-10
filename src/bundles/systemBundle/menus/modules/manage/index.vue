<template>
  <el-form ref="form" label-width="80px" :model="form" size="small">
    <el-form-item label="菜单名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入菜单名称"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import FormMixins from '@/mixins/FormMixins'

let defaultForm = {}

export default {
  name: 'SystemMenusManage',
  mixins: [FormMixins],
  data() {
    return {
      rules: []
    }
  },
  methods: {
    initData() {

    },
    formatFormData() {
      this.initData()
      if (this.options) {
        return {

        }
      } else {
        return { ...defaultForm }
      }
    }
  }
}
</script>
