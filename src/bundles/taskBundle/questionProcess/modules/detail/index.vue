<template>
  <div class="jc-detail">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
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
        <span>{{form.problemType}}</span>
      </el-form-item>
      <el-form-item label="附件">
        <el-image v-for="url in imgs" :key="url" :src="url" :preview-src-list="imgs" class="jc-img"></el-image>
        <video v-for="url in videos" :key="url" :src="url" alt="" controls class="jc-video"></video>
        <audio v-for="url in audios" :key="url" :src="url" alt="" controls class="jc-audio"></audio>
      </el-form-item>
    </el-form>
    <div class="jc-detail-footer" v-if="form.handle">
      <el-button @click="toSuperior" :loading="loading" type="primary" size="small" v-if="!firstOrgIds.includes(form.orgId)">反馈至上级</el-button>
      <el-button @click="generateTask" :loading="loading" type="primary" size="small">生成任务</el-button>
      <el-button @click="closeQuestion" :loading="loading" size="small">关闭问题</el-button>
    </div>
  </div>
</template>
<script>
import { questionReport } from '@/api/question'

export default {
  name: 'TaskQuestionProcessDetail',
  props: {
    info: {
      type: Object,
      default: ()=>{}
    },
    firstOrgIds: {
      type: Array
    }
  },
  data() {
    return {
      loading: false,
      handle: false,
      imgs: [],
      videos: [],
      audios: []
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
        const { uploadFilePaths } = newValue

        this.handleUrls(uploadFilePaths)
      },
      deep: true
    }
  },
  created() {
  },
  methods: {
    //根据文件格式 区分url
    handleUrls(urls) {
      const imgs = [], videos = [], audios = []

      if (urls && urls.length) {
        const imgReg = /\.(png|jpg|gif|jpeg|svg)$/,
          videoReg = /\.(mp4|rm|rmvb|wmv|asf|asx|3gp|mov|m4v|avi|dat|mkv|flv|vob)$/,
          audioReg = /\.(mp3|cd|wave|aiff|mpeg|mpeg-4|midi|wma|realaudio|vqf|oggvorbis|amr|ape|flac|aac)$/

        urls.forEach(url=>{
          if (imgReg.test(url)) {
            imgs.push(url)
          }
          if (videoReg.test(url)) {
            videos.push(url)
          }
          if (audioReg.test(url)) {
            audios.push(url)
          }
        })
      }
      this.imgs = imgs
      this.videos = videos
      this.audios = audios
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
      const { id, problemTitle, taskId } = this.form

      this.$router.push({ name: 'taskProcess', query: { id, taskId, problemTitle } })
    },
    //关闭问题
    closeQuestion() {
      this.$confirm('确认关闭问题', '提示', { type: 'warning' }).then(async () => {
        try {
          this.loading = true
          const form = {
            ifUpload: false,
            ifClose: true
          }

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
  margin: 0 auto;
}
.jc-detail-footer {
  text-align: center;
}
.jc-img {
  width: 130px;
  height: 120px;
  border-radius: 5px;
}
.jc-video,
.jc-audio {
  width: 48%;
  margin: 0 1%;
  border-radius: 5px;
}
</style>
