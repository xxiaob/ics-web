<template>
  <div class="jc-media">
    <div class="swiper-container" v-show="urls&&urls.length">
      <div class="swiper-wrapper">
        <div v-for="url in imgs" :key="url.id" class="swiper-slide jc-img">
          <img class="img" :src="url" alt="">
        </div>
        <div class="jc-video swiper-slide" v-for="url in videos" :key="url" @click="showVideo(url)">
          <video :src="url"></video>
          <div class="hover">
            <img class="jc-video-play" src="./assets/play.png" alt="" width="40">
          </div>
        </div>
        <div v-for="(url,index) in audios" :key="url" class="jc-audio swiper-slide" @click="playAudio(url,index)">
          <div class="hover">
            <img class="jc-video-play" src="./assets/play.png" alt="" width="40" v-show="audioPlayShows[index]">
            <img class="jc-video-play" src="./assets/pause.png" alt="" width="40" v-show="!audioPlayShows[index]">
          </div>
        </div>
        <audio v-if="show" ref="audio" :src="audioUrl" style="width:0;height:0" @ended="audioEnded"></audio>
        <!-- <a class="jc-other swiper-slide" v-for="url in others" :key="url" :href="url" download="" title="点击下载">
          <img class="jc-other-down" src="@/bundles/taskBundle/assets/down.png" alt="">
        </a> -->
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
import MediaMixins from '@/bundles/taskBundle/mixins/MediaMixins'

export default {
  mixins: [MediaMixins],
  name: 'ScreenProjectionMedia',
  props: {
    urls: {
      type: Array,
      default: ()=>[]
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: true
    }
  },
  watch: {
    urls: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.handleUrls(newValue)
      }
    }
  },
  mounted() {
    setTimeout(()=>{
      this.mySwiper = new Swiper('.swiper-container', {
        autoplay: {
          delay: 1000,
          stopOnLastSlide: false,
          disableOnInteraction: true
        },
        slidesPerView: 3,
        spaceBetween: 10
      })
    }, 100)
  }
}
</script>

<style lang="scss" scoped>
.jc-media {
  // width: 410px;
  padding: 0 10px;
  box-sizing: border-box;
  // height: 150px;
  background: url(./assets/border.png) no-repeat;
  background-size: 100% 100%;

  .jc-media-title {
    color: #8bc1fc;
    font-size: 16px;
    text-align: center;
    line-height: 36px;
  }
}

.swiper-container {
  // height: 100px;
  margin-top: 10px;
}

.swiper-slide {
  color: white;
  text-align: center;
  // padding: 0 5px;
  box-sizing: border-box;
  height: 100px;
}

.jc-img,
.jc-video,
.jc-audio,
.jc-other {
  cursor: pointer;
  position: relative;

  .img {
    width: 100%;
    height: 100%;
    // object-fit: contain;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hover {
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // background: rgba($color: #000000, $alpha: 0.2);

    .jc-video-play {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -20px;
      margin-top: -20px;
    }
  }
  .jc-other-down {
    position: absolute;
    left: 48px;
    top: 32px;
  }
  &:hover .hover {
    display: block;
  }
}
.jc-audio {
  background: url(./assets/audio.gif) no-repeat center;
  background-size: 100% 100%;
}
</style>
