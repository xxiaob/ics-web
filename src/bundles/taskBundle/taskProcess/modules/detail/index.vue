<template>
  <div>
    <div class="jc-card-title">{{form.handle?'任务处理':'任务详情'}}</div>
    <el-card class="jc-table-card jc-mt">
      <div slot="header">
        <div class="jc-title">基础信息</div>
      </div>
      <el-form ref="form" label-width="90px" :model="form" class="jc-manage-form" size="small">
        <div class="jc-clearboth">
          <el-form-item label="任务名称：" class="jc-left-width25">
            <span>{{form.taskName}}</span>
          </el-form-item>
          <el-form-item label="创建时间：" class="jc-left-width25">
            <span>{{form.createTime|filterTime}}</span>
          </el-form-item>
          <el-form-item label="项目名称：" class="jc-left-width50">
            <span>{{form.projectName}}</span>
          </el-form-item>
        </div>
        <div class="jc-clearboth">
          <el-form-item label="任务时间：" class="jc-left-width50">
            <span>{{form.startDate|filterTime}} - {{form.endDate|filterTime}}</span>
          </el-form-item>
          <el-form-item label="任务类型：" class="jc-left-width25">
            <span>{{form.taskTypeName}}</span>
          </el-form-item>
          <el-form-item label="任务状态：" class="jc-left-width25">
            <span>{{form.taskStatusName}}</span>
          </el-form-item>
        </div>
        <div class="jc-clearboth">
          <el-form-item label="任务来源：" class="jc-left-width50">
            <span>{{taskSourceName}}</span>
          </el-form-item>
          <el-form-item label="下发组织：" class="jc-left-width25">
            <span>{{form.startOrg}}</span>
          </el-form-item>
          <el-form-item label="下发人：" class="jc-left-width25">
            <span>{{form.startUser}}</span>
          </el-form-item>
        </div>
        <div class="jc-clearboth">
          <el-form-item label="任务位置：" class="jc-left-width50">
            <span>{{form.taskPositionName}}</span>
          </el-form-item>
          <el-form-item label="任务人员：" class="jc-left-width50">
            {{formatUsers}}
          </el-form-item>
        </div>
        <el-form-item label="任务描述：">
          <div v-html="form.taskDesc"></div>
        </el-form-item>
        <el-form-item label="附件：">
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
            <img class="jc-other-down" src="../../../assets/down.png" alt="">
          </a>
        </el-form-item>
      </el-form>
    </el-card>


    <el-row :gutter="12" type="flex" class="jc-mt">
      <el-col :span="superviseShow ? 12: 24">
        <el-card class="jc-table-card jc-height100">
          <div slot="header">
            <div class="jc-title">流转记录</div>
          </div>
          <jc-forward-list :taskId="form.businessKey" ref="forward"></jc-forward-list>
        </el-card>
      </el-col>
      <el-col :span="12" v-if="superviseShow">
        <el-card class="jc-table-card jc-height100">
          <div slot="header">
            <div class="jc-title">督办信息</div>
          </div>
          <el-form ref="superviseInfo" label-width="100px" :model="form" class="jc-manage-form" size="mini">
            <el-form-item label="督办人员：">
              <span>{{ superviseInfo.userName }}</span>
            </el-form-item>
            <el-form-item label="督办时间：">
              <span>{{superviseInfo.createTime | filterTime}}</span>
            </el-form-item>
            <el-form-item label="督办意见：">
              <span>{{superviseInfo.remark}}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

    </el-row>
    <el-card class="jc-table-card jc-mt" v-if="TASK_STATES.FINISHED==form.state">
      <div slot="header">
        <div class="jc-title">关联事件</div>
      </div>
      <jc-event-list :taskId="form.businessKey"></jc-event-list>
    </el-card>
    <div class="jc-detail-footer">
      <el-button @click="handleTask(true)" size="small" v-if="form.handle">流转任务</el-button>
      <el-button @click="handleTask(false)" size="small" v-if="form.handle">完成任务</el-button>
      <el-button @click="closeTask" size="small" v-if="form.handle">关闭任务</el-button>
      <el-button size="small" type="primary" @click="downloadFile" v-if="form.uploadFilePaths&&form.uploadFilePaths.length">文件下载</el-button>
      <el-button size="small" type="primary" @click="downloadDetail">报表下载</el-button>
      <el-button size="small" type="primary" @click="$emit('update:detailShow', false)">返回</el-button>
    </div>
    <el-dialog :title="taskForm.ifUpload?'流转任务':'完成任务'" :visible.sync="dialogVisibleHandle" :close-on-click-modal="false" width="600px" append-to-body>
      <el-form ref="taskForm" label-width="80px" :model="taskForm" class="jc-manage-form" size="mini">
        <el-form-item label="任务人员" :prop="peopleProps[peopleType]" :rules="rules.SELECT_NOT_NULL" v-if="taskForm.ifUpload" class="jc-mb">
          <jc-task-people :peopleType.sync="peopleType" :selecteds.sync="peoples" :orgTree="orgTree"></jc-task-people>
        </el-form-item>
        <el-form-item label="事件" prop="eventIds" :rules="rules.SELECT_NOT_NULL" v-if="!taskForm.ifUpload" class="jc-mb">
          <el-select v-model="taskForm.eventIds" multiple clearable filterable placeholder="请选择事件">
            <el-option v-for="item in events" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark" :rules="rules.NOT_NULL">
          <el-input v-model="taskForm.remark" placeholder="请输入备注" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleHandle = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitTask">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { taskFinish, taskDel, exportTemporaryDetail, fileDownload } from '@/api/task'
import { eventManageSelectList } from '@/api/eventManage'
import { NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import { formatDate } from '@/libs/util'
import { TASK_SOURCES, TASK_STATES, TASK_PEOPLE_TYPES } from '@/constant/Dictionaries'
import MediaMixins from '../../../mixins/MediaMixins'

export default {
  name: 'TaskProcessDetail',
  mixins: [MediaMixins],
  props: {
    detailShow: false,
    info: {
      type: Object,
      default: ()=>{}
    },
    orgTree: {
      type: Array
    },
    orgObj: {
      type: Object
    }
  },
  components: {
    JcEventList: () => import('./eventList'),
    JcForwardList: () => import('./forwardList'),
    JcTaskPeople: () => import('../manage/taskPeople')
  },
  data() {
    return {

      peopleType: TASK_PEOPLE_TYPES.PEOPLE,
      peopleProps: {
        [TASK_PEOPLE_TYPES.ORG]: 'orgIds',
        [TASK_PEOPLE_TYPES.PEOPLE]: 'userIds'
      },
      peoples: [],
      TASK_STATES,
      loading: false,
      dialogVisibleHandle: false,
      events: [],
      handle: false,
      rules: {
        SELECT_NOT_NULL,
        NOT_NULL
      },
      taskForm: {
        ifUpload: false,
        remark: '',
        orgIds: [],
        userIds: [],
        eventIds: []
      },
      superviseShow: false, // 是否存在督办
      superviseInfo: null // 督办数据
    }
  },
  watch: {
    peoples: {
      handler(val) {
        if (this.peopleType === TASK_PEOPLE_TYPES.ORG) {
          this.taskForm.userIds = []
          this.taskForm.orgIds = val
        } else {
          this.taskForm.userIds = val
          this.taskForm.orgIds = []
        }
      },
      deep: true
    },
    form: {
      handler(newValue) {
        if (newValue.taskDetailVO && newValue.taskDetailVO.uploadFilePaths) {
          this.handleUrls(newValue.taskDetailVO.uploadFilePaths)
        }
      },
      deep: true
    }
  },
  computed: {
    form() {
      if (this.info) {
        // 处理督办信息
        let taskSupervisePO = this.info.taskSupervisePO

        if (taskSupervisePO) {
          this.superviseShow = true
          this.superviseInfo = {
            createTime: taskSupervisePO.createTime,
            remark: taskSupervisePO.remark,
            userName: taskSupervisePO.userName

          }
        } else {
          this.superviseShow = false
          this.superviseInfo = null
        }
        return { ...this.info, ...this.info.detailViewVO, ...this.info.taskDetailVO, taskStatusName: this.info.taskStatusName }
      } else {
        return {}
      }
    },
    taskSourceName() {
      return TASK_SOURCES.toString(this.form.taskSource) + ' ' + (this.form.taskSourceName ? this.form.taskSourceName : '')
    },
    formatUsers() {
      if (this.form.assignees && this.form.assignees.length) {
        const userNames = this.form.assignees.map(item=>item.userName)

        return userNames.join('、')
      } else if (this.form.orgIds && this.form.orgIds.length) {
        const orgNames = this.form.orgIds.map(value=>this.orgObj[value])

        return orgNames.join('、')
      } else {
        return ''
      }
    }
  },
  filters: {
    filterTime(value) {
      return formatDate(value)
    }
  },
  created() {
    this.remoteMethod('')
  },
  methods: {
    async remoteMethod(query) {
      this.loading = true
      try {
        this.events = await eventManageSelectList(query)
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },
    handleTask(ifUpload) {
      if (this.$refs.taskForm) {
        this.$refs.taskForm.resetFields()
      }
      this.taskForm.userIds = []
      this.taskForm.orgIds = []
      this.taskForm.ifUpload = ifUpload
      this.dialogVisibleHandle = true
    },
    closeTask() {
      this.$confirm('确认关闭任务', '提示', { type: 'warning' }).then(() => {
        this.remove()
      }).catch(() => {})
    },
    async remove() {
      try {
        await taskDel(this.form.businessKey)
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.dialogVisibleHandle = false
        this.$emit('save-success')
        this.loading = false
        this.$emit('update:detailShow', false)
      } catch (error) {
        console.error(error)
      }
    },
    onSubmitTask() {
      this.loading = true
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          this.nextTo()
        } else {
          this.loading = false
        }
      })
    },
    //流转
    async nextTo() {
      const { businessKey, taskId } = this.form
      const { ifUpload, remark, userIds, orgIds, eventIds } = this.taskForm
      const form = {
        ifUpload, // true 流转  false 完成
        businessKey,
        taskId,
        remark,
        eventIds
      }

      if (ifUpload) { // 流转带上组织id 或者 用户id
        if (userIds.length) {
          form.assignees = userIds
        } else {
          form.orgIds = orgIds
        }
      }
      console.log(form)
      try {
        await taskFinish(form)
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.dialogVisibleHandle = false
        this.$emit('save-success')
        this.$refs.forward.initData()
        this.loading = false
        this.$emit('update:detailShow', false)
      } catch (e) {
        this.loading = false
        console.error(e)
      }
    },
    downloadDetail() {
      console.log('downloadDetail')
      exportTemporaryDetail(this.form.businessKey)
    },
    downloadFile() {
      console.log('downloadFile')
      fileDownload(this.form.businessKey)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../css/media.scss";
.el-form /deep/ .el-form-item {
  margin-bottom: 0;
}
.jc-mb {
  margin-bottom: 22px !important;
}
.el-card /deep/ .el-card__header {
  border: none;
}
.jc-title {
  color: $jc-color-primary;
}
.jc-detail-footer {
  text-align: center;
  margin-top: $jc-default-dis;
}

.jc-height100{
  height:100%;
  min-height: 100%;

  /deep/ .el-form-item {
    margin-bottom: 20px;
  }
}
.jc-left-width50 {
  width: 50%;
  float: left;
}
.jc-left-width25 {
  width: 25%;
  float: left;
}
.jc-clearboth::after,
.jc-clearboth::before {
  content: "";
  display: table;
  clear: both;
}
.el-textarea /deep/ textarea {
  font-family: "微软雅黑", "Microsoft Yahei", "Helvetica Naue", Helvetica,
    sans-serif !important;
}
</style>
