<template>
  <div class="jc-content data-statistics-scrollbar">
    <el-form label-width="100px" :model="form" size="mini">
      <el-form-item label="任务名称 : ">
        <span>{{form.taskName}}</span>
      </el-form-item>
      <el-form-item label="创建时间 : ">
        <span>{{form.createTime|filterTime}}</span>
      </el-form-item>
      <el-form-item label="项目名称 : ">
        <span>{{formatProject}}</span>
      </el-form-item>
      <el-form-item label="任务周期 : ">
        <span>{{form.startDate|filterDate}} - {{form.endDate|filterDate}}</span>
      </el-form-item>
      <el-form-item label="任务类型 : ">
        <span>日常任务</span>
      </el-form-item>
      <el-form-item label="任务状态 : ">
        <span>{{form.taskStatusName}}</span>
      </el-form-item>
      <el-form-item label="下发组织 : ">
        <span>{{form.startOrg}}</span>
      </el-form-item>
      <el-form-item label="下发人 : ">
        <span>{{form.startUser}}</span>
      </el-form-item>
      <el-form-item label="任务人员 : ">
        {{formatUsers}}
      </el-form-item>
      <el-form-item label="在岗时间 : " style="white-space: pre-line;">{{form.taskTimePOS|filterTimePos}}</el-form-item>
      <el-form-item label="在岗时长 : ">
        {{form.workTime}} 小时
      </el-form-item>
      <el-form-item label="在岗人数 : ">
        {{form.workPeopleNbr}}
      </el-form-item>
      <el-form-item label="任务频率 : ">
        <span>{{formatWorkFrequency}}</span>
      </el-form-item>
      <el-form-item label="准点到岗 : ">
        <span>{{form.ifOnTime?'是':'否'}}</span>
      </el-form-item>
      <el-form-item label="任务描述 : ">
        <div v-html="form.taskDesc"></div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { formatDate } from '@/libs/util'
import { projectsList } from '@/api/projects'
import { taskGetDaily } from '@/api/task'
import moment from 'moment'
import { PROJECT_TYPES, TASK_FREQUENCYS } from '@/constant/Dictionaries'
import { MESSAGE_DATA_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'ScreenDataCenterContentScreenProjectioncDailyTask',
  props: {
    options: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      form: {},
      projectListArr: []
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

      return (project[0] && project[0].label) || PROJECT_TYPES.toString(PROJECT_TYPES.NORMAL)
    },
    formatWorkFrequency() {
      return TASK_FREQUENCYS.toString(this.form.workFrequency) || `${this.form.workFrequency}天`
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
  watch: {
    options: {
      deep: true,
      handler() {
        if (this.options && this.options.id && this.options.type === MESSAGE_DATA_TYPES.TASK) {
          this.getDetail()
        }
      }
    }
  },
  async created() {
    await this.formatProjectList()
    // console.log('projectListArr', this.projectListArr)
    if (this.options && this.options.id && this.options.type === MESSAGE_DATA_TYPES.TASK) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      if (!this.loading) {
        this.loading = true
        try {
          const res = await taskGetDaily(this.options.id)

          this.form = { ...res, ...res.detailViewVO, ...res.taskDetailVO }
          this.loading = false
        } catch (error) {
          this.form = {}
          this.loading = false
        }
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../css/index.scss";
</style>
