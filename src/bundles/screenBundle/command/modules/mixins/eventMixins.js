
export default {
  data() {
    return {}
  },
  created() {
    this.$EventBus.$on('show-word-change', this.eventShowWordChange) //监听文字显示切换
  },
  methods: {
    eventShowWordChange(words) {
      console.log('event', arguments)
      this.eventTipVisible = words.includes('event') //如果存在用户显示，则显示用户，否则不显示
      console.log(this.eventTipVisible)
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('show-word-change', this.orgShowWordChange)
  }
}
