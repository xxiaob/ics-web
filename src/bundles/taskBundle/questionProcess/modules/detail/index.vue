<template>
  <div>
    <el-card class="jc-table-card">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">{{form&&form.handle?'处理问题':'问题详情'}}</div>
        <div class="jc-button-group">
          <el-button size="small" icon="el-icon-arrow-left" @click="$emit('update:detailShow', false)">返回</el-button>
        </div>
      </div>
      <div class="jc-detail">
        <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form" size="small">
          <el-form-item label="问题ID">
            <span>{{form.id}}</span>
          </el-form-item>
          <el-form-item label="上报人">
            <span>{{form.userName}}</span>
          </el-form-item>
          <el-form-item label="所属组织">
            <span>{{form.orgName}}</span>
          </el-form-item>
          <el-form-item label="问题标题">
            <span>{{form.problemTitle}}</span>
          </el-form-item>
          <el-form-item label="问题类型">
            <span>{{form.problemTypeName}}</span>
          </el-form-item>
          <el-form-item label="问题来源">
            <span>{{formatSource(form.problemSource)}}</span>
          </el-form-item>
          <el-form-item label="问题位置">
            <span>{{form.positionName}}</span>
          </el-form-item>
          <el-form-item label="问题描述">
            <div v-html="form.problemDesc"></div>
          </el-form-item>
          <el-form-item label="附件">
            <el-image v-for="url in imgs" :key="url" :src="url" :preview-src-list="imgs" class="jc-img"></el-image>
            <div class="jc-video" v-for="url in videos" :key="url" @click="showVideo(url)">
              <video :src="url"></video>
              <div class="hover">
                <img class="jc-video-play" src="../../../assets/play.png" alt="">
              </div>
            </div>
            <div v-for="(url,index) in audios" :key="url" class="jc-audio" @click="playAudio(url,index)">
              <img class="jc-audio-mike" src="../../../assets/mike.png" alt="">
              <div class="hover">
                <img class="jc-video-play" src="../../../assets/play.png" alt="" v-show="audioPlayShows[index]">
                <img class="jc-video-play" src="../../../assets/pause.png" alt="" v-show="!audioPlayShows[index]">
              </div>
            </div>
            <audio v-if="detailShow" ref="audio" :src="audioUrl" style="width:0;height:0" @ended="audioEnded"></audio>
            <a class="jc-other" v-for="url in others" :key="url" :href="url" download="" title="点击下载">
              <img class="jc-other-down" src="@/bundles/taskBundle/assets/down.png" alt="">
            </a>
          </el-form-item>
        </el-form>
        <div class="jc-detail-footer">
          <el-button v-if="form.handle" @click="toSuperior" :loading="loading" type="primary" size="small">反馈至上级</el-button>
          <el-button v-if="form.handle" @click="generateTask" :loading="loading" type="primary" size="small">生成任务</el-button>
          <el-button v-if="form.handle" @click="closeQuestion" :loading="loading" size="small">关闭问题</el-button>
          <el-button size="small" type="primary" @click="downloadFile" v-if="form.uploadFilePaths&&form.uploadFilePaths.length">文件下载</el-button>
          <el-button size="small" type="primary" @click="downloadDetail">报表下载</el-button>
        </div>

        <task-manage :projectId="form.projectId" :question="question" :visible.sync="TaskManageShow" @save-success="generateTaskSuccess"></task-manage>

        <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="800px" :close-on-click-modal="false" :append-to-body="true">
          <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
        </el-dialog>
      </div>
    </el-card>
    <jc-task :problemId="form.id"></jc-task>
  </div>

</template>
<script>
import { QUESTION_SOURCES } from '@/constant/Dictionaries'
import { questionReport, exportDetail, fileDownload } from '@/api/question'
import MediaMixins from '../../../mixins/MediaMixins'

export default {
  name: 'QuestionProcessDetail',
  props: {
    info: {
      type: Object,
      default: ()=>{}
    },
    detailShow: {
      type: Boolean
    }
  },
  mixins: [MediaMixins],
  components: {
    TaskManage: () => import('../../../taskProcess/modules/manage'),
    JcTask: ()=>import('./task.vue')
  },
  data() {
    return {
      loading: false,
      handle: false,
      question: null,
      TaskManageShow: false
    }
  },
  computed: {
    form() {
      return this.info || {}
    }
  },
  watch: {
    info: {
      handler(newValue) {
        if (this.detailShow) {
          const { uploadFilePaths } = newValue

          this.handleUrls(uploadFilePaths)
        }
      },
      deep: true
    }
  },
  methods: {
    formatSource(value) {
      return QUESTION_SOURCES.toString(value + '')
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
        this.$emit('save-success')
        this.$emit('update:detailShow', false)
      } catch (error) {
        this.loading = false
        console.error(error)
      }
    },
    downloadDetail() {
      console.log('downloadDetail')
      exportDetail(this.form.id)
    },
    downloadFile() {
      console.log('downloadFile')
      fileDownload(this.form.id)
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-detail {
  width: 600px;
  margin: 20px auto 0;
}
.jc-detail-footer {
  text-align: center;
}
@import "../../../css/media.scss";
</style>
