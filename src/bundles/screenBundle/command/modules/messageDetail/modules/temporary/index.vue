<template>
  <div class="jc-temporary">
    <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务名称</div>
        <div class="jc-detail-content">{{form.taskName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务名称</div>
        <div class="jc-detail-content">{{form.taskName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务名称</div>
        <div class="jc-detail-content">{{form.taskName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务名称</div>
        <div class="jc-detail-content">{{form.taskName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务名称</div>
        <div class="jc-detail-content">{{form.taskName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务名称</div>
        <div class="jc-detail-content">{{form.taskName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">创建时间</div>
        <div class="jc-detail-content">{{form.createTime|filterTime}}</div>
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
          <a class="jc-other" v-for="url in others" :key="url" :href="url" download="" title="点击下载">
            <img class="jc-other-down" src="@/bundles/taskBundle/assets/down.png" alt="">
          </a>
        </div>
      </div>
    </div>

    <div class="jc-footer">
      <el-button @click="handleTask(true)" size="small" type="primary">流转任务</el-button>
      <el-button @click="handleTask(false)" size="small">结束任务</el-button>
    </div>

  </div>

</template>
<script>
import { taskGet } from '@/api/task'
import { projectsList } from '@/api/projects'
import { organizationList } from '@/api/organization'
import { PROJECT_TYPES, TASK_SOURCES } from '@/constant/Dictionaries'
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
    JcTaskPeople: () => import('@/bundles/taskBundle/taskProcess/modules/manage/taskPeople')
  },
  data() {
    return {
      loading: false,
      form: {},
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
        userIds: []
      }
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
    const res = await organizationList()

    this.orgObj = this.formatOrgTreeToObj(res)

    await this.formatProjectList()

    if (this.info && this.info.id) {
      this.getDetail()
    }
  },
  computed: {
    taskSourceName() {
      if (this.form.taskSourceName) {
        return this.form.taskSourceName
      } else {
        return TASK_SOURCES.toString(this.form.taskSource)
      }
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

      return (project[0] && project[0].label) || ''
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

      this.projectListArr = [...PROJECT_TYPES.VALUES]
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
        return null
      }
    },
    async getDetail() {
      if (!this.loading) {
        this.loading = true
        const res = await taskGet(this.info.id)

        this.form = { ...this.info, ...res, ...res.detailViewVO, ...res.taskDetailVO }
        this.handleUrls(this.form.uploadFilePaths)
        this.loading = false
      } else {
        this.getDetail()
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
}
.jc-footer {
  text-align: center;
  padding: 10px 0;
}
@import "@/bundles/taskBundle/css/media.scss";
</style>
