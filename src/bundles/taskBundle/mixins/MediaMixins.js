/**
 * 媒体文件显示 页面混入处理
 */
export default {
  data() {
    return {
      dialogVideoVisible: false,
      dialogVideoUrl: '',
      audioPlayShows: [],
      audioUrl: '',
      imgs: [],
      videos: [],
      audios: [],
      others: []
    }
  },
  methods: {
    //根据文件格式 区分url
    handleUrls(urls) {
      const audio = this.$refs.audio

      if (audio && !audio.paused) {
        audio.pause()
      }

      const imgs = [], videos = [], audios = [], others = []

      if (urls && urls.length) {
        const imgReg = /\.(png|jpg|gif|jpeg|svg)$/,
          videoReg = /\.(mp4|rm|rmvb|wmv|asf|asx|3gp|mov|m4v|avi|dat|mkv|flv|vob)$/,
          audioReg = /\.(mp3|cd|wave|aiff|mpeg|mpeg-4|midi|wma|realaudio|vqf|oggvorbis|amr|ape|flac|aac)$/

        urls.forEach(url => {
          if (imgReg.test(url.toLowerCase())) {
            imgs.push(url)
          } else if (videoReg.test(url.toLowerCase())) {
            videos.push(url)
          } else if (audioReg.test(url.toLowerCase())) {
            audios.push(url)
          } else {
            others.push(url)
          }
        })
      }
      this.imgs = imgs
      this.videos = videos
      this.audios = audios
      this.others = others
      this.audioPlayShows = new Array(this.audios.length).fill(true)
    },
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
