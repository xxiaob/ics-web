/**
 * Form 页面混入处理
 */
export default {
  data() {
    return {

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
      this.$refs.form.resetFields()
      if (this.initData) {
        this.initData()
      }
    }
  }
}
