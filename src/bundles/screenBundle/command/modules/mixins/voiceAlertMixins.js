/**
 * 声音提醒
 */

export default {
  created() {
    this.$EventBus.$on('map-voice-alert', this.voicePlay)
  },
  methods: {
    voicePlay() {

    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('map-voice-alert', this.voicePlay)
  }
}
