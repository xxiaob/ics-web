<template>
  <el-dialog title="事件详情" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose" top="5vh">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form" size="mini">
      <el-form-item label="事件ID：">
        <span>{{form.eventNumber}}</span>
      </el-form-item>
      <el-form-item label="上报人：">
        <span>{{form.reportUserName}}</span>
      </el-form-item>
      <el-form-item label="所属组织：">
        <span>{{form.orgName}}</span>
      </el-form-item>
      <el-form-item label="事件标题：">
        <span>{{form.eventTitle}}</span>
      </el-form-item>
      <el-form-item label="上报地点：">
        <span>{{form.positionName}}</span>
      </el-form-item>
      <el-form-item label="事件类型：">
        <span>{{form.typeName}}</span>
      </el-form-item>
      <el-form-item label="事件描述：">
        <!-- <span>{{form.desc}}</span> -->
        <div v-html="form.desc"></div>
      </el-form-item>
      <el-form-item label="处理前图片：">
        <el-image v-for="url in form.beforePhotos" :key="url" :src="url" :preview-src-list="form.beforePhotos" class="jc-img"></el-image>
      </el-form-item>
      <el-form-item label="处理后图片：">
        <el-image v-for="url in form.afterPhotos" :key="url" :src="url" :preview-src-list="form.afterPhotos" class="jc-img"></el-image>
      </el-form-item>
      <el-form-item label="视频文件：">
        <div class="jc-video" v-for="url in form.videoAddrs" :key="url" @click="showVideo(url)">
          <video :src="url"></video>
          <div class="hover">
            <img class="jc-video-play" src="@/bundles/taskBundle/assets/play.png" alt="">
          </div>
        </div>
      </el-form-item>
      <el-form-item label="音频文件：" prop="audioAddr">
        <div v-for="(url,index) in form.audioAddrs" :key="url" class="jc-audio" @click="playAudio(url,index)">
          <img class="jc-audio-mike" src="@/bundles/taskBundle/assets/mike.png" alt="">
          <div class="hover">
            <img class="jc-video-play" src="@/bundles/taskBundle/assets/play.png" alt="" v-show="audioPlayShows[index]">
            <img class="jc-video-play" src="@/bundles/taskBundle/assets/pause.png" alt="" v-show="!audioPlayShows[index]">
          </div>
        </div>
        <audio v-if="dialogVisible" ref="audio" :src="audioUrl" style="width:0;height:0" @ended="audioEnded"></audio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="download">文件下载</el-button>
      <el-button type="primary" @click="download">报表下载</el-button>
      <el-button @click="dialogVisible = false">关闭窗口</el-button>
    </div>
    <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="800px" :close-on-click-modal="false" :append-to-body="true">
      <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { eventManageGet } from '@/api/eventManage'
import MediaMixins from '@/bundles/taskBundle/mixins/MediaMixins'

export default {
  name: 'EventManageDetail',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: ()=>{}
    }
  },
  mixins: [MediaMixins],
  watch: {
    visible(newVal) {
      if (newVal) {
        this.dialogVisible = true
      }
    },
    info: {
      // immediate: true,
      deep: true,
      handler() {
        this.getDetail()
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {},
      audios: []
    }
  },
  created() {
    if (this.info && this.info.id) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      const res = await eventManageGet(this.info.id)

      this.form = { ...this.info, ...res }
      this.audios = this.form.audioAddrs
      this.audioPlayShows = new Array(this.audios.length).fill(true)
    },
    dialogClose() {
      this.$emit('update:visible', false)
    },
    download() {
      console.log('download')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/bundles/taskBundle/css/media.scss";
.dialog-footer {
  text-align: center;
}
</style>
