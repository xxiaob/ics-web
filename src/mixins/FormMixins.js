/**
 * Form 页面混入处理
 */
export default {
  data() {
    return {
      form: this.formatFormData(),
      dialogVisible: false
    }
  },
  props: ['options', 'visible'],
  computed: {
    isEdit() {
      return this.options !== null
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initForm()
      }
    }
  },
  methods: {
    initForm() {
      this.form = this.formatFormData()
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      if (this.initData) {
        this.initData()
      }
      this.dialogVisible = this.visible
    },
    dialogClose() {
      this.$emit('update:visible', false)
    }
  }
}
