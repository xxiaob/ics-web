<template>
  <div class="jc-question">

    <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
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
        <div class="jc-detail-label">问题标题</div>
        <div class="jc-detail-content">{{form.problemTitle}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">问题描述</div>
        <div class="jc-detail-content">{{form.problemDesc}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">问题类型</div>
        <div class="jc-detail-content">{{formatType(form.problemType)}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">附件</div>
        <div class="jc-detail-content">
          <el-image v-for="url in imgs" :key="url" :src="url" :preview-src-list="imgs" class="jc-img"></el-image>
          <div class="jc-video" v-for="url in videos" :key="url" @click="showVideo(url)">
            <video :src="url"></video>
            <div class="hover">
              <img class="jc-video-play" src="@/bundles/taskBundle/assets/play.png" alt="">
            </div>
          </div>
          <div v-for="(url,index) in audios" :key="url" class="jc-audio" @click="playAudio(url,index)">
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
      <el-button @click="toSuperior" :loading="loading" type="primary" size="small">反馈至上级</el-button>
      <el-button @click="generateTask" :loading="loading" type="primary" size="small">生成任务</el-button>
      <el-button @click="closeQuestion" :loading="loading" size="small">关闭问题</el-button>
    </div>

    <task-manage :question="question" :visible.sync="TaskManageShow" @save-success="generateTaskSuccess"></task-manage>

  </div>

</template>
<script>
import { questionReport, questionGet, questionTypeList } from '@/api/question'
import MediaMixins from '@/bundles/taskBundle/mixins/MediaMixins'

export default {
  name: 'ScreenCommandMessageDetailQuestion',
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
      types: [],
      question: null,
      TaskManageShow: false
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
  async created() {
    this.types = await questionTypeList() || []
    if (this.info && this.info.id) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      if (!this.loading) {
        this.loading = true
        const res = await questionGet(this.info.id)

        this.form = { ...this.info, ...res }
        this.handleUrls(this.form.uploadFilePaths)
        this.loading = false
      } else {
        this.getDetail()
      }
    },
    formatType(value) {
      const type = this.types.filter(item=>item.id == value)

      return (type[0] && type[0].typeName) || ''
    },
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
      const { id, problemTitle } = this.form

      this.question = {
        key: id.toString(),
        value: id,
        label: problemTitle
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
}
.jc-footer {
  text-align: center;
  padding: 10px 0;
}
@import "@/bundles/taskBundle/css/media.scss";
</style>
