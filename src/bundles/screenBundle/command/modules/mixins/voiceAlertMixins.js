/**
 * 声音提醒
 */
import { VoiceSource } from '@/config/JcVoiceAlertConfig'

export default {
  created() {
    this.$EventBus.$on('map-voice-alert', this.voicePlay)
  },
  methods: {
    voicePlay(data) {
      let source = VoiceSource[data.type]

      if (source) {
        this.$refs.myScreenAudio.src = source
        this.$refs.myScreenAudio.play()
      }
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('map-voice-alert', this.voicePlay)
  }
}
