/**
 * 声音提醒
 */
import { VoiceSource, VOICE_TYPE } from '@/config/JcVoiceAlertConfig'
import { getWarningPlay } from '@/libs/storage'
const warningVoices = [VOICE_TYPE.GRID_ABNORMAL, VOICE_TYPE.GRID_ARRIVE_ABNORMAL, VOICE_TYPE.GRID_TIME_ABNORMAL, VOICE_TYPE.GRID_USER_ABNORMAL, VOICE_TYPE.USER_ABNORMAL, VOICE_TYPE.TEMPORARY_ABNORMAL]

export default {
  created() {
    this.$EventBus.$on('map-voice-alert', this.voicePlay)
    this.$EventBus.$on('map-voice-end', this.voicePause)
  },
  methods: {
    voicePlay(data) {
      console.log('指挥大屏，收到提示音处理', data)
      if (getWarningPlay() == '' && warningVoices.includes(data.type)) {
        console.log('告警提示音不播放')
        return
      }
      const audio = this.$refs.myScreenAudio

      if (audio.paused) { //audio 在暂停状态 才允许播放
        console.log('play 播放提示音')
        let source = VoiceSource[data.type]

        if (data.loop) {
          audio.loop = 'loop'
        } else {
          audio.removeAttribute('loop')
        }

        if (source) {
          audio.src = source
          audio.play()
        }
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
