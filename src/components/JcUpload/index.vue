<template>
  <div>
    <div class="jc-clearboth">
      <div v-for="url in imgs" :key="url.id" class="jc-img">
        <el-image :src="url" :preview-src-list="imgs"></el-image>
        <img class="jc-close" src="@/bundles/taskBundle/assets/close.png" alt="" @click.stop="handleRemove(url)">
      </div>
      <div class="jc-video" v-for="url in videos" :key="url" @click="showVideo(url)">
        <video :src="url"></video>
        <div class="hover">
          <img class="jc-video-play" src="@/bundles/taskBundle/assets/play.png" alt="">
        </div>
        <img class="jc-close" src="@/bundles/taskBundle/assets/close.png" alt="" @click.stop="handleRemove(url)">
      </div>
      <div v-for="(url,index) in audios" :key="url" class="jc-audio" @click="playAudio(url,index)">
        <img class="jc-audio-mike" src="@/bundles/taskBundle/assets/mike.png" alt="">
        <div class="hover">
          <img class="jc-video-play" src="@/bundles/taskBundle/assets/play.png" alt="" v-show="audioPlayShows[index]">
          <img class="jc-video-play" src="@/bundles/taskBundle/assets/pause.png" alt="" v-show="!audioPlayShows[index]">
        </div>
        <img class="jc-close" src="@/bundles/taskBundle/assets/close.png" alt="" @click.stop="handleRemove(url)">
      </div>
      <audio v-if="show" ref="audio" :src="audioUrl" style="width:0;height:0" @ended="audioEnded"></audio>
      <a class="jc-other" v-for="url in others" :key="url" :href="url" download="" title="点击下载">
        <img class="jc-other-down" src="@/bundles/taskBundle/assets/down.png" alt="">
        <img class="jc-close" src="@/bundles/taskBundle/assets/close.png" alt="" @click.stop.prevent="handleRemove(url)">
      </a>
    </div>

    <el-upload :action="uploadUrl" :accept="accept" :headers="uploadHeaders" :before-upload="handleBeforeUpload" :on-success="handleSuccess" :show-file-list="false">
      <el-button size="small" type="primary" :loading="loading">点击上传</el-button>
    </el-upload>

    <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="800px" :close-on-click-modal="false" :append-to-body="true">
      <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/API'
import { getToken } from '@/libs/storage'
import MediaMixins from '@/bundles/taskBundle/mixins/MediaMixins'

export default {
  mixins: [MediaMixins],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    urls: {
      type: Array,
      default: ()=>[]
    },
    accept: {
      type: String,
      default: ''
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
  data() {
    return {
      uploadUrl: process.env.API_HOST.base + api.upload,
      uploadHeaders: { token: getToken() },
      loading: false
    }
  },
  methods: {
    handleRemove(url) {
      // console.log('删除', url)
      // 图片  删除最后一个不会报错，删除前面的会报错 但是不影响结果  element ui报错
      const urls = this.urls.slice(0)
      const index = urls.indexOf(url)

      urls.splice(index, 1)
      this.$emit('update:urls', urls)
    },
    handleBeforeUpload() {
      this.loading = true
    },
    handleSuccess(res) {
      if (res.resCode) {
        this.$emit('update:urls', [...this.urls, res.resData.url])
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.resMsg.msgText)
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-clearboth::before,
.jc-clearboth::after {
  display: table;
  content: "";
  clear: both;
}
@import "@/bundles/taskBundle/css/media.scss";
</style>
