<template>
  <el-form>

  </el-form>
</template>
<script>
let defaultForm = {}

export default {
  name: 'SystemMenusManage',
  data() {
    return {
      form: {}
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
