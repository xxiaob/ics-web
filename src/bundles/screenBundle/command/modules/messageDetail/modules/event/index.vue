<template>
  <div class="jc-event">
    <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <div class="jc-detail-warp">
        <div class="jc-detail-label">事件ID</div>
        <div class="jc-detail-content">{{form.eventNumber}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">{{SYSTEM_MESSAGE_TYPE.DREGS==info.systemSourceType?'处置人':'上报人'}}</div>
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
      <div class="jc-detail-warp" v-if="SYSTEM_MESSAGE_TYPE.DREGS==info.systemSourceType">
        <div class="jc-detail-label">车牌号</div>
        <div class="jc-detail-content">{{form.carNumber}}</div>
      </div>
      <div class="jc-detail-warp" v-else>
        <div class="jc-detail-label">事件类型</div>
        <div class="jc-detail-content">{{form.typeName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">{{SYSTEM_MESSAGE_TYPE.DREGS==info.systemSourceType?'处置地点':'上报地点'}}</div>
        <div class="jc-detail-content">{{form.positionName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">事件描述</div>
        <div class="jc-detail-content">
          <div v-html="form.desc"></div>
        </div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">处理前图片</div>
        <div class="jc-detail-content">
          <!-- <el-image v-for="url in form.beforePhotos" :key="url" :src="url" :preview-src-list="form.beforePhotos" class="jc-img"></el-image> -->
          <img v-for="url in form.beforePhotos" :key="url" :src="url" class="jc-img" @click="showFullImg(url,form.beforePhotos)">
        </div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">处理后图片</div>
        <div class="jc-detail-content">
          <!-- <el-image v-for="url in form.afterPhotos" :key="url" :src="url" :preview-src-list="form.afterPhotos" class="jc-img"></el-image> -->
          <img v-for="url in form.afterPhotos" :key="url" :src="url" class="jc-img" @click="showFullImg(url,form.afterPhotos)">
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

    </div>
    <div class="jc-footer">
      <el-button @click="sendScreen" type="primary" size="small">{{isSendScreen?'关闭投屏':'投屏'}}</el-button>
    </div>

    <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="800px" :close-on-click-modal="false" :append-to-body="true">
      <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
    </el-dialog>
  </div>

</template>
<script>
import { eventManageGet } from '@/api/eventManage'
import MediaMixins from '@/bundles/taskBundle/mixins/MediaMixins'
import { MESSAGE_DATA_TYPES, SYSTEM_MESSAGE_TYPE } from '@/constant/Dictionaries'

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
      SYSTEM_MESSAGE_TYPE,
      form: {},
      loading: false,
      isSendScreen: false
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
    showFullImg(url, imgs) {
      // console.log('showFullImg', url, this.imgs)
      this.$EventBus.$emit('show-full-img', { url, imgs })
    },
    sendScreen() {
      if (this.isSendScreen) {
        this.isSendScreen = false
        this.$EventBus.$emit('screen-message-channel', { type: MESSAGE_DATA_TYPES.CLOSR, closeType: MESSAGE_DATA_TYPES.EVENT })
        this.$message.success('关闭投屏成功')
      } else {
        this.isSendScreen = true
        this.$EventBus.$emit('screen-message-channel', { type: MESSAGE_DATA_TYPES.EVENT, data: { ...this.info } })
        this.$message.success('投屏发送成功')
      }
    },
    async getDetail() {
      if (!this.loading) {
        this.loading = true
        try {
          const res = await eventManageGet(this.info.id)

          this.form = { ...this.info, ...res }
          this.audios = this.form.audioAddrs
          this.audioPlayShows = new Array(this.audios.length).fill(true)
          this.loading = false
        } catch (error) {
          this.form = { ...this.info }
          this.loading = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-event {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.jc-footer {
  text-align: center;
  padding: 10px 0;
}
@import "@/bundles/taskBundle/css/media.scss";
</style>
