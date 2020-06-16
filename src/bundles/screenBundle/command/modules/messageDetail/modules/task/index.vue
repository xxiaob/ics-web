<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
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
      <div class="jc-detail-label">任务周期</div>
      <div class="jc-detail-content">{{form.startDate|filterTime}} - {{form.endDate|filterTime}}</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">任务类型</div>
      <div class="jc-detail-content">{{form.taskTypeName}}</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">任务状态</div>
      <div class="jc-detail-content">{{form.taskStatusName}}</div>
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
      <div class="jc-detail-label">任务人员</div>
      <div class="jc-detail-content">{{formatUsers}}</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">在岗时间</div>
      <div class="jc-detail-content">{{form.taskTimePOS|filterTimePos}}</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">在岗时长</div>
      <div class="jc-detail-content">{{form.workTime}} 小时</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">在岗人数</div>
      <div class="jc-detail-content">{{form.workPeopleNbr}}</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">任务描述</div>
      <div class="jc-detail-content">
        <div v-html="form.taskDesc"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { taskGetDaily } from '@/api/task'
import { formatDate } from '@/libs/util'
import { NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
export default {
  name: 'ScreenCommandMessageDetailTask',
  props: {
    info: {
      type: Object,
      default: ()=>{}
    }
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
  created() {
    if (this.info && this.info.id) {
      this.getDetail()
    }
  },
  computed: {
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
    async getDetail() {
      if (!this.loading) {
        this.loading = true
        const res = await taskGetDaily(this.info.id)

        this.form = { ...this.info, ...res, ...res.detailViewVO, ...res.taskDetailVO }
        this.loading = false
      } else {
        this.getDetail()
      }
    }
  }

}
</script>
