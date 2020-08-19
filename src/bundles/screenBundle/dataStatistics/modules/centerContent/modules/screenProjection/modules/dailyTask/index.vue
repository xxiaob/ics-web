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
        <span>{{form.projectName}}</span>
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
import { taskGetDaily } from '@/api/task'
import moment from 'moment'
import { TASK_FREQUENCYS } from '@/constant/Dictionaries'
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
      form: {}
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../css/index.scss";
</style>
