/**
 * 媒体文件显示 页面混入处理
 */
export default {
  data() {
    return {
      dialogVideoVisible: false,
      dialogVideoUrl: '',
      audioPlayShows: [],
      audioUrl: ''
    }
  },
  methods: {
    //播放视频
    showVideo(url) {
      const audio = this.$refs.audio

      if (!audio.paused) {
        audio.pause()
        this.audioPlayShows = new Array(this.audios.length).fill(true)
      }

      this.dialogVideoUrl = url
      this.dialogVideoVisible = true
    },
    //播放音频
    playAudio(url, index) {
      this.audioUrl = url
      setTimeout(() => {
        const audio = this.$refs.audio
        const shows = new Array(this.audios.length).fill(true)

        if (audio.paused) {
          audio.play()
          shows[index] = false
        } else {
          audio.pause()
        }
        this.audioPlayShows = shows
      })
    },
    //监听音频播放结束
    audioEnded() {
      this.audioPlayShows = new Array(this.audios.length).fill(true)
    }
  }
}
