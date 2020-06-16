<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-detail-warp">
      <div class="jc-detail-label">事件ID</div>
      <div class="jc-detail-content">{{form.eventNumber}}</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">上报人</div>
      <div class="jc-detail-content">{{form.reportUserName}}</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">所属组织</div>
      <div class="jc-detail-content">{{form.orgName}}</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">事件标题</div>
      <div class="jc-detail-content">{{form.eventTitle}}</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">事件描述</div>
      <div class="jc-detail-content">{{form.desc}}</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">上报地点</div>
      <div class="jc-detail-content">{{form.positionName}}</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">事件类型</div>
      <div class="jc-detail-content">{{form.typeName}}</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">处理前图片</div>
      <div class="jc-detail-content">
        <el-image v-for="url in form.beforePhotos" :key="url" :src="url" :preview-src-list="form.beforePhotos" class="jc-img"></el-image>
      </div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">处理后图片</div>
      <div class="jc-detail-content">
        <el-image v-for="url in form.afterPhotos" :key="url" :src="url" :preview-src-list="form.afterPhotos" class="jc-img"></el-image>
      </div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">视频文件</div>
      <div class="jc-detail-content">
        <div class="jc-video" v-for="url in form.videoAddrs" :key="url" @click="showVideo(url)">
          <video :src="url"></video>
          <div class="hover">
            <img class="jc-video-play" src="@/bundles/taskBundle/assets/play.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">音频文件</div>
      <div class="jc-detail-content">
        <div v-for="(url,index) in form.audioAddrs" :key="url" class="jc-audio" @click="playAudio(url,index)">
          <img class="jc-audio-mike" src="@/bundles/taskBundle/assets/mike.png" alt="">
          <div class="hover">
            <img class="jc-video-play" src="@/bundles/taskBundle/assets/play.png" alt="" v-show="audioPlayShows[index]">
            <img class="jc-video-play" src="@/bundles/taskBundle/assets/pause.png" alt="" v-show="!audioPlayShows[index]">
          </div>
        </div>
        <audio ref="audio" :src="audioUrl" style="width:0;height:0" @ended="audioEnded"></audio>
      </div>
    </div>

    <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="800px" :close-on-click-modal="false" :append-to-body="true">
      <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
    </el-dialog>
  </div>
</template>
<script>
import { eventManageGet } from '@/api/eventManage'
import MediaMixins from '@/bundles/taskBundle/mixins/MediaMixins'

export default {
  name: 'ScreenCommandMessageDetailEvent',
  props: {
    info: {
      type: Object,
      default: ()=>{}
    }
  },
  mixins: [MediaMixins],
  data() {
    return {
      form: {},
      loading: false
    }
  },
  watch: {
    info: {
      deep: true,
      handler() {
        this.getDetail()
      }
    }
  },
  created() {
    if (this.info && this.info.id) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      if (!this.loading) {
        this.loading = true
        const res = await eventManageGet(this.info.id)

        this.form = { ...this.info, ...res }
        this.audios = this.form.audioAddrs
        this.audioPlayShows = new Array(this.audios.length).fill(true)
        this.loading = false
      } else {
        this.getDetail()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/bundles/taskBundle/css/media.scss";
</style>
