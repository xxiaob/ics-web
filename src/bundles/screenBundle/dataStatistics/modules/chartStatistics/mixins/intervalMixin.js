export default {
  props: {
    initActivated: {
      default: 1
    }
  },
  watch: {
    initActivated(val) {
      if (val !== this.activated) {
        this.activated = val
        this.processData()
      }
    }
  }
}
