<template>
  <div class="jc-video-warp"></div>
</template>
<script>
export default {
  name: 'ScreenCommandVideoWarp',
  data() {
    return {

    }
  },
  created() {
    this.$EventBus.$on('device-video-play', this.videoPlay) //监听视频播放
  },
  methods: {
    videoPlay(data) {

    }
  },
  beforeDestroy() {
    this.$EventBus.$off('device-video-play', this.videoPlay) //监听视频播放
  }
}
</script>
