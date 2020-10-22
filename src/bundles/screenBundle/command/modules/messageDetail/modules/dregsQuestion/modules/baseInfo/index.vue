<template>
  <div class="jc-question">

    <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <div class="jc-detail-warp">
        <div class="jc-detail-label">问题标题</div>
        <div class="jc-detail-content">{{form.problemTitle}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">问题ID</div>
        <div class="jc-detail-content">{{form.id}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">上报人</div>
        <div class="jc-detail-content">{{form.userName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">所属组织</div>
        <div class="jc-detail-content">{{form.orgName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">车牌号</div>
        <div class="jc-detail-content">{{form.carNumber}}</div>
      </div>
      <!-- <div class="jc-detail-warp">
        <div class="jc-detail-label">问题类型</div>
        <div class="jc-detail-content">{{formatType(form.problemType)}}</div>
      </div> -->
      <div class="jc-detail-warp">
        <div class="jc-detail-label">运输公司</div>
        <div class="jc-detail-content">{{form.transportCompany}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">查处地址</div>
        <div class="jc-detail-content">{{form.positionName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">问题描述</div>
        <div class="jc-detail-content">
          <div v-html="form.problemDesc"></div>
        </div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">现场照片</div>
        <div class="jc-detail-content">
          <img v-for="url in form.filePO&&form.filePO.photos" :key="url" :src="url" class="jc-img" @click="showFullImg(url)">
        </div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">视频</div>
        <div class="jc-detail-content">
          <div class="jc-video" v-for="url in form.filePO&&form.filePO.videoAddrs" :key="url" @click="showVideo(url)">
            <video :src="url"></video>
            <div class="hover">
              <img class="jc-video-play" src="@/bundles/taskBundle/assets/play.png" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">音频</div>
        <div class="jc-detail-content">
          <div v-for="(url,index) in form.filePO&&form.filePO.audioAddrs" :key="url" class="jc-audio" @click="playAudio(url,index)">
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
      <el-button v-if="form.auth" @click="toSuperior" :loading="loading" type="primary" size="small">反馈至上级</el-button>
      <el-button v-if="form.auth" @click="generateTask" :loading="loading" type="primary" size="small">生成任务</el-button>
      <el-button v-if="form.auth" @click="closeQuestion" :loading="loading" size="small">关闭问题</el-button>
      <el-button style="margin-top: 10px;" @click="sendScreen" type="primary" size="small">{{isSendScreen?'关闭投屏':'投屏'}}</el-button>
    </div>

    <task-manage :question="question" :visible.sync="TaskManageShow" @save-success="generateTaskSuccess"></task-manage>

  </div>

</template>
<script>
import { questionReport, questionGet, getProblemAuth } from '@/api/question'//questionTypeList,
import MediaMixins from '@/bundles/taskBundle/mixins/MediaMixins'
import { MESSAGE_DATA_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'ScreenCommandMessageDetailQuestionBaseInfo',
  props: {
    info: {
      type: Object,
      default: ()=>{}
    }
  },
  mixins: [MediaMixins],
  components: {
    TaskManage: () => import('@/bundles/taskBundle/taskProcess/modules/manage')
  },
  data() {
    return {
      loading: false,
      form: {},
      // types: [],
      question: null,
      TaskManageShow: false,
      isSendScreen: false
    }
  },
  watch: {
    info: {
      deep: true,
      handler() {
        if (this.info && this.info.id) {
          this.getDetail()
        }
      }
    }
  },
  async created() {
    // this.types = await questionTypeList() || []
    if (this.info && this.info.id) {
      this.getDetail()
    }
  },
  methods: {
    showFullImg(url) {
      // console.log('showFullImg', url, this.imgs)
      this.$EventBus.$emit('show-full-img', { url, imgs: this.imgs })
    },
    sendScreen() {
      if (this.isSendScreen) {
        this.isSendScreen = false
        this.$EventBus.$emit('screen-message-channel', { type: MESSAGE_DATA_TYPES.CLOSR, closeType: MESSAGE_DATA_TYPES.QUESTION })
        this.$message.success('关闭投屏成功')
      } else {
        this.isSendScreen = true
        this.$EventBus.$emit('screen-message-channel', { type: MESSAGE_DATA_TYPES.QUESTION, data: { ...this.info } })
        this.$message.success('投屏发送成功')
      }
    },
    async getDetail() {
      if (!this.loading) {
        this.loading = true
        try {
          const res = await questionGet(this.info.id)
          const auth = await getProblemAuth(this.info.id)

          this.form = { ...res, auth: auth.auth, taskId: auth.taskId }
          this.handleUrls(this.form.uploadFilePaths)
          this.loading = false
        } catch (error) {
          this.form = {}
          this.loading = false
        }
      }
    },
    // formatType(value) {
    //   const type = this.types.filter(item=>item.id == value)

    //   return (type[0] && type[0].typeName) || ''
    // },
    //反馈至上级
    toSuperior() {
      this.$confirm('确认反馈至上级 ', '提示', { type: 'warning' }).then(async () => {
        this.loading = true
        const form = {
          ifUpload: true
        }

        this.questionReport(form)
      }).catch(() => {})
    },
    //生成任务
    async generateTask() {
      const { id, problemTitle, uploadFilePaths, position, positionName, problemDesc } = this.form

      this.question = {
        // key: id.toString(),
        value: id,
        label: problemTitle,
        uploadFilePaths,
        position,
        positionName,
        problemDesc
      }
      this.TaskManageShow = true
    },
    //成功生成任务后的回调
    generateTaskSuccess() {
      this.loading = true
      const form = {
        ifUpload: false,
        ifClose: false
      }

      try {
        this.questionReport(form)
      } catch (e) {
        console.error(e)
      }
    },
    //关闭问题
    closeQuestion() {
      this.$confirm('确认关闭问题', '提示', { type: 'warning' }).then(async () => {
        this.loading = true
        const form = {
          ifUpload: false,
          ifClose: true
        }

        try {
          this.questionReport(form)
        } catch (e) {
          console.error(e)
        }
      }).catch(() => {})
    },
    async questionReport(form) {
      const { id: businessKey, taskId } = this.form

      try {
        await questionReport({ businessKey, taskId, ...form })
        this.$message.success('操作成功')
        this.loading = false
        // this.$emit('save-success')
        this.getDetail()
        this.$EventBus.$emit('view-component-back')
      } catch (error) {
        this.loading = false
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-question {
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
