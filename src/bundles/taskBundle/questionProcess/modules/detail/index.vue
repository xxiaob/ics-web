<template>
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
      <el-form-item label="问题描述">
        <span>{{form.problemDesc}}</span>
      </el-form-item>
      <el-form-item label="问题类型">
        <span>{{formatType(form.problemType)}}</span>
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
      </el-form-item>
    </el-form>
    <div class="jc-detail-footer" v-if="form.handle">
      <el-button @click="toSuperior" :loading="loading" type="primary" size="small">反馈至上级</el-button>
      <!-- v-if="!firstOrgIds.includes(form.orgId)" -->
      <el-button @click="generateTask" :loading="loading" type="primary" size="small">生成任务</el-button>
      <el-button @click="closeQuestion" :loading="loading" size="small">关闭问题</el-button>
    </div>

    <task-manage :orgTree="orgTree" :orgId="orgId" :question="question" :visible.sync="TaskManageShow" @save-success="generateTaskSuccess"></task-manage>

    <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="800px" :close-on-click-modal="false" :append-to-body="true">
      <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
    </el-dialog>
  </div>
</template>
<script>
import { questionReport } from '@/api/question'
import MediaMixins from '../../../mixins/MediaMixins'

export default {
  name: 'TaskQuestionProcessDetail',
  props: {
    orgTree: {
      type: Array
    },
    orgId: {
      type: String
    },
    types: {
      type: Array,
      default: ()=>[]
    },
    info: {
      type: Object,
      default: ()=>{}
    },
    firstOrgIds: {
      type: Array
    },
    detailShow: {
      type: Boolean
    }
  },
  mixins: [MediaMixins],
  components: {
    TaskManage: () => import('../../../taskProcess/modules/manage')
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
        this.$emit('save-success')
        this.$emit('update:detailShow', false)
      } catch (error) {
        this.loading = false
        console.error(error)
      }
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
