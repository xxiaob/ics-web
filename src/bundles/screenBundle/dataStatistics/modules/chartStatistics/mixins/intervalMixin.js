export default {
  data() {
    return {
      activated: 1,
      intervalTime: 10000
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.changeType()
    }, this.intervalTime)
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    changeType(val) {
      if (val) {
        if (val !== this.activated) {
          this.activated = val
          this.processData()
        } else {
          console.log('请勿重复点击')
        }
      } else {
        console.log('setInterval changeType', this.activated)
        if (this.activated === 1) {
          this.activated = 2
        } else if (this.activated === 2) {
          this.activated = 3
        } else if (this.activated === 3) {
          this.activated = 1
        }
        this.processData()
      }
    },
    mouseenter() {
      if (this.interval) {
        clearInterval(this.interval)
      }
    },
    mouseleave() {
      this.interval = setInterval(() => {
        this.changeType()
      }, this.intervalTime)
    }
  }
}
