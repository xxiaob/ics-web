/**
 * 声音提醒
 */
import { VoiceSource } from '@/config/JcVoiceAlertConfig'

export default {
  created() {
    this.$EventBus.$on('map-voice-alert', this.voicePlay)
    this.$EventBus.$on('map-voice-end', this.voicePause)
  },
  methods: {
    voicePlay(data) {
      console.log('指挥大屏，收到提示音处理', data)
      let source = VoiceSource[data.type]

      if (data.loop) {
        this.$refs.myScreenAudio.loop = 'loop'
      } else {
        this.$refs.myScreenAudio.removeAttribute('loop')
      }

      if (source) {
        this.$refs.myScreenAudio.src = source
        this.$refs.myScreenAudio.play()
      }
    },
    voicePause() {
      const audio = this.$refs.myScreenAudio

      if (audio && !audio.paused) {
        audio.pause()
      }
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('map-voice-alert', this.voicePlay)
    this.$EventBus.$off('map-voice-end', this.voicePause)
  }
}
