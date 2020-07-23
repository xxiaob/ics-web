<template>
  <div class="jc-media">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="./assets/audio.gif" alt="">
        </div>
        <div class="swiper-slide">
          <img src="./assets/audio.gif" alt="">
        </div>
        <div class="swiper-slide">
          <img src="./assets/audio.gif" alt="">
        </div>
        <div class="swiper-slide">
          <img src="./assets/audio.gif" alt="">
        </div>
      </div>
    </div>

    <div class="jc-media-title">{{title}}</div>

    <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="800px" :close-on-click-modal="false" :append-to-body="true">
      <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
    </el-dialog>
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'

export default {
  name: 'ScreenProjectionMedia',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVideoVisible: false
    }
  },
  mounted() {
    setTimeout(()=>{
      this.mySwiper = new Swiper('.swiper-container', {
        autoplay: true,
        slidesPerView: 3
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.jc-media {
  // width: 410px;
  padding: 10px;
  box-sizing: border-box;
  height: 160px;
  background: url(./assets/border.png) no-repeat;
  background-size: 100% 100%;

  .jc-media-title {
    color: #8bc1fc;
    font-size: 16px;
    text-align: center;
    line-height: 36px;
  }
}

.swiper-slide {
  color: white;
  text-align: center;
  padding: 0 5px;
  box-sizing: border-box;
  height: 100px;
}
</style>
