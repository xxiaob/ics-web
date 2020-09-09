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

          <el-form-item label="告警类型：">
            <span>{{form.alarmTypeName}}</span>
          </el-form-item>
          <el-form-item label="企业：">
            <span>{{form.transportCompany}}</span>
          </el-form-item>
          <el-form-item label="企业地址：">
            <span>{{form.transportCompany}}</span>
          </el-form-item>

          <el-form-item label="车牌号：">
            <span>{{form.carNumber}}</span>
          </el-form-item>
          <el-form-item label="时间：">
            <span>{{form.alarmDate}}</span>
          </el-form-item>
          <el-form-item label="车速：">
            <span>{{form.carSpeed}}</span>
          </el-form-item>
          <el-form-item label="状态：">
            <span>{{form.status}}</span>
          </el-form-item>

        </el-form>
        <div class="jc-detail-footer">
          <el-button v-if="form.handle" @click="toSuperior" :loading="loading" type="primary" size="small">反馈至上级</el-button>
          <el-button v-if="form.handle" @click="generateTask" :loading="loading" type="primary" size="small">生成任务</el-button>
          <el-button v-if="form.handle" @click="closeQuestion" :loading="loading" size="small">关闭问题</el-button>
        </div>

        <task-manage :orgTree="orgTree" :user="user" :question="question" :visible.sync="TaskManageShow" @save-success="generateTaskSuccess"></task-manage>
        <!-- <task-manage :projectId="form.projectId" :orgTree="orgTree" :user="user" :question="question" :visible.sync="TaskManageShow" @save-success="generateTaskSuccess"></task-manage> -->

        <!-- <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="800px" :close-on-click-modal="false" :append-to-body="true">
          <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
        </el-dialog> -->
      </div>
    </el-card>
    <jc-task :problemId="form.id"></jc-task>
  </div>

</template>
<script>
import { questionReport } from '@/api/question'
// import MediaMixins from '@/bundles/taskBundle/mixins/MediaMixins'

export default {
  name: 'QuestionProcessDetail',
  props: {
    orgTree: {
      type: Array
    },
    user: {
      type: Object
    },
    types: {
      type: Array,
      default: ()=>[]
    },
    info: {
      type: Object,
      default: ()=>{}
    },
    // firstOrgIds: {
    //   type: Array
    // },
    detailShow: {
      type: Boolean
    }
  },
  // mixins: [MediaMixins],
  components: {
    TaskManage: () => import('@/bundles/taskBundle/taskProcess/modules/manage'),
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
    // info: {
    //   handler(newValue) {
    //     if (this.detailShow) {
    //       const { uploadFilePaths } = newValue

    //       this.handleUrls(uploadFilePaths)
    //     }
    //   },
    //   deep: true
    // }
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
      console.log('告警处理,this.form', this.form)
      // const { id, problemTitle, uploadFilePaths, position, positionName } = this.form
      const { alarmTypeName } = this.form


      this.question = {
        // key: id.toString(), // 暂时不存在
        // value: id,
        key: this.form.id || '111111111', // 暂时不存在
        value: 111111111,
        label: alarmTypeName,
        uploadFilePaths: [],
        questionTaskSource: '告警信息',
        position: '',
        positionName: ''
      }
      // this.question = this.form
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
@import "@/bundles/taskBundle/css/media.scss";
</style>
