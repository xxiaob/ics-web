<template>
  <div class="jc-temporary">
    <div class="jc-header">
      <div :class="{activate:activate==='1'}" @click="changeActivate('1')">基础信息</div>
      <div :class="{activate:activate==='2'}" @click="changeActivate('2')">流转记录</div>
      <div :class="{activate:activate==='3'}" @click="changeActivate('3')">关联事件</div>
    </div>

    <div v-show="activate==='1'" class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务名称</div>
        <div class="jc-detail-content">{{form.taskName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">创建时间</div>
        <div class="jc-detail-content">{{form.createDate|filterTime}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">项目名称</div>
        <div class="jc-detail-content">{{formatProject}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务时间</div>
        <div class="jc-detail-content">{{form.startDate|filterTime}} - {{form.endDate|filterTime}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务类型</div>
        <div class="jc-detail-content">临时任务</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务状态</div>
        <div class="jc-detail-content">{{form.taskStatusName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务来源</div>
        <div class="jc-detail-content">{{taskSourceName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">下发组织</div>
        <div class="jc-detail-content">{{form.startOrg}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">下发人</div>
        <div class="jc-detail-content">{{form.startUser}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务位置</div>
        <div class="jc-detail-content">{{form.taskPositionName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务人员</div>
        <div class="jc-detail-content">{{formatUsers}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务描述</div>
        <div class="jc-detail-content">
          <div v-html="form.taskDesc"></div>
        </div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">附件</div>
        <div class="jc-detail-content">
          <img v-for="url in imgs" :key="url" :src="url" class="jc-img" @click="showFullImg(url)">
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
          <a class="jc-other" v-for="url in others" :key="url" :href="url" download="" title="点击下载">
            <img class="jc-other-down" src="@/bundles/taskBundle/assets/down.png" alt="">
          </a>
        </div>
      </div>
    </div>
    <div v-show="activate==='2'" class="jc-view-content jc-forward" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <jc-forward-list :taskId="form.businessKey" ref="forward"></jc-forward-list>
    </div>
    <div v-show="activate==='3'" class="jc-view-content jc-event" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <jc-event-list :taskId="form.businessKey" :small="true"></jc-event-list>
    </div>
    <div class="jc-footer">
      <el-button v-if="form.auth" @click="handleTask(true)" size="small" type="primary">流转任务</el-button>
      <el-button v-if="form.auth" @click="handleTask(false)" size="small">结束任务</el-button>
      <el-button @click="sendScreen" type="primary" size="small">{{isSendScreen?'关闭投屏':'投屏'}}</el-button>
    </div>

    <el-dialog :title="taskForm.ifUpload?'流转任务':'结束任务'" :visible.sync="dialogVisibleHandle" :close-on-click-modal="false" width="600px" append-to-body>
      <el-form ref="taskForm" label-width="80px" :model="taskForm" class="jc-manage-form">
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
import { taskGet, taskFinish, getTaskAuth } from '@/api/task'
import { eventManageSelectList } from '@/api/eventManage'
import { projectsList } from '@/api/projects'
import { organizationList } from '@/api/organization'
import { PROJECT_TYPES, TASK_SOURCES, TASK_PEOPLE_TYPES, MESSAGE_DATA_TYPES } from '@/constant/Dictionaries'
import { formatDate } from '@/libs/util'
import { NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import moment from 'moment'
import MediaMixins from '@/bundles/taskBundle/mixins/MediaMixins'

export default {
  name: 'ScreenCommandMessageDetailTemporary',
  props: {
    info: {
      type: Object,
      default: ()=>{}
    }
  },
  mixins: [MediaMixins],
  components: {
    JcTaskPeople: () => import('@/bundles/taskBundle/taskProcess/modules/manage/taskPeople'),
    JcForwardList: () => import('@/bundles/taskBundle/taskProcess/modules/detail/forwardList'),
    JcEventList: () => import('@/bundles/taskBundle/taskProcess/modules/detail/eventList')
  },
  data() {
    return {
      activate: '1',
      peopleType: TASK_PEOPLE_TYPES.ORG,
      peopleProps: {
        [TASK_PEOPLE_TYPES.ORG]: 'orgIds',
        [TASK_PEOPLE_TYPES.PEOPLE]: 'userIds'
      },
      peoples: [],
      dialogVisibleHandle: false,
      events: [],
      loading: false,
      form: {},
      orgTree: [],
      orgObj: {},
      projectListArr: [],
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
      isSendScreen: false
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
    info: {
      deep: true,
      handler() {
        this.getDetail()
      }
    }
  },
  async created() {
    const res = await organizationList()

    this.orgTree = this.formatOrgTree(res)
    this.orgObj = this.formatOrgTreeToObj(res)

    await this.formatProjectList()
    await this.remoteMethod('')

    if (this.info && this.info.id) {
      this.getDetail()
    }
  },
  computed: {
    taskSourceName() {
      return TASK_SOURCES.toString(this.form.taskSource) + ' ' + this.form.taskSourceName
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
    },
    formatProject() {
      const project = this.projectListArr.filter(item=>item.value == this.form.projectId)

      return (project[0] && project[0].label) || PROJECT_TYPES.toString(PROJECT_TYPES.NORMAL)
    }
  },
  filters: {
    filterTime(value) {
      return formatDate(value)
    },
    filterDate(value) {
      return moment(value).format('YYYY-MM-DD')
    },
    filterTimePos(value) {
      if (value) {
        const times = value.map(item=>`${item.startTime} - ${item.endTime}`)

        return times.join('\n')
      } else {
        return ''
      }
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
        this.$EventBus.$emit('screen-message-channel', { type: MESSAGE_DATA_TYPES.CLOSR, closeType: MESSAGE_DATA_TYPES.TEMPORARY })
        this.$message.success('关闭投屏成功')
      } else {
        this.isSendScreen = true
        this.$EventBus.$emit('screen-message-channel', { type: MESSAGE_DATA_TYPES.TEMPORARY, data: { id: this.info.id } })
        this.$message.success('投屏发送成功')
      }
    },
    changeActivate(val) {
      this.activate = val
    },
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
    formatOrgTree(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = {
            id: item.orgId,
            value: item.orgId,
            label: item.orgName
          }

          let children = this.formatOrgTree(item.children)

          if (children && children.length) {
            node.children = children
          }

          trees.push(node)
        })
      }
      return trees
    },
    formatOrgTreeToObj(child) {
      let objs = {}

      if (child && child.length) {
        child.forEach(item => {
          if (item.children && item.children.length) {
            objs = Object.assign(objs, this.formatOrgTreeToObj(item.children))
          }
          objs[item.orgId] = item.orgName
        })
      }
      return objs
    },
    async  formatProjectList() {
      this.EmergencySupport = await this.getProjectList(PROJECT_TYPES.EmergencySupport)
      this.SpecialControl = await this.getProjectList(PROJECT_TYPES.SpecialControl)

      // this.projectListArr = [...PROJECT_TYPES.VALUES]
      this.projectListArr = []
      if (this.EmergencySupport) {
        this.projectListArr = [...this.projectListArr, ...this.EmergencySupport]
      }
      if (this.SpecialControl) {
        this.projectListArr = [...this.projectListArr, ...this.SpecialControl]
      }
    },
    async getProjectList(projectType) {
      const res = await projectsList({ projectType })

      if (res && res.length) {
        return res.map(item=>({ value: item.projectId, label: item.projectName }))
      } else {
        return []
      }
    },
    async getDetail() {
      if (!this.loading) {
        this.loading = true
        try {
          const res = await taskGet(this.info.id)
          const auth = await getTaskAuth(this.info.id)

          this.form = { ...this.info, ...res, ...res.detailViewVO, ...res.taskDetailVO, auth: auth.auth, taskId: auth.taskId }
          this.handleUrls(this.form.uploadFilePaths)
          this.loading = false
        } catch (error) {
          this.form = { ...this.info }
          this.loading = false
        }
      } else {
        this.getDetail()
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
        this.dialogVisibleHandle = false
        this.loading = false
        this.getDetail()
        this.$EventBus.$emit('view-component-back')
      } catch (e) {
        this.loading = false
        console.error(e)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.jc-temporary {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.jc-footer {
  text-align: center;
  padding: 10px 0;
}
.jc-header {
  display: flex;
  padding: 5px 0;
  border-bottom: 1px solid #cccccc;
  & > div {
    flex: 1;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
  }
  & > div:not(:last-child) {
    border-right: 1px solid #cccccc;
  }
  .activate {
    color: $jc-color-primary;
  }
}

.jc-forward,
.jc-event {
  padding: 10px;
}
.el-textarea /deep/ textarea {
  font-family: "微软雅黑", "Microsoft Yahei", "Helvetica Naue", Helvetica,
    sans-serif !important;
}
@import "@/bundles/taskBundle/css/media.scss";
</style>
