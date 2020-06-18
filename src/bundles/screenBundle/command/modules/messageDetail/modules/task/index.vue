<template>
  <div class="jc-task">
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
        <div class="jc-detail-content">{{form.startDate|filterDate}} - {{form.endDate|filterDate}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务类型</div>
        <div class="jc-detail-content">日常任务</div>
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

    <div class="jc-footer">
      <el-button @click="handleTask(true)" size="small" type="primary">流转任务</el-button>
      <el-button @click="handleTask(false)" size="small" type="primary">添加备注</el-button>
    </div>

    <el-dialog :title="taskForm.ifUpload?'流转任务':'添加备注'" :visible.sync="dialogVisibleHandle" :close-on-click-modal="false" width="600px" append-to-body>
      <el-form ref="taskForm" label-width="80px" :model="taskForm" class="jc-manage-form">
        <el-form-item label="任务人员" :prop="peopleProps[peopleType]" :rules="rules.SELECT_NOT_NULL" v-if="taskForm.ifUpload" class="jc-mb">
          <jc-task-people :peopleType.sync="peopleType" :selecteds.sync="peoples" :orgTree="orgTree"></jc-task-people>
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
import { taskGetDaily, taskFinish, taskAddRemark } from '@/api/task'
import { projectsList } from '@/api/projects'
import { organizationList } from '@/api/organization'
import { PROJECT_TYPES, TASK_PEOPLE_TYPES } from '@/constant/Dictionaries'
import { formatDate } from '@/libs/util'
import { NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import moment from 'moment'

export default {
  name: 'ScreenCommandMessageDetailTask',
  props: {
    info: {
      type: Object,
      default: ()=>{}
    }
  },
  components: {
    JcTaskPeople: () => import('@/bundles/taskBundle/taskProcess/modules/manage/taskPeople')
  },
  data() {
    return {
      peopleType: TASK_PEOPLE_TYPES.ORG,
      peoples: [],
      peopleProps: {
        [TASK_PEOPLE_TYPES.ORG]: 'orgIds',
        [TASK_PEOPLE_TYPES.PEOPLE]: 'userIds'
      },
      dialogVisibleHandle: false,
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
    },
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
    }
  },
  async created() {
    const res = await organizationList()

    this.orgTree = this.formatOrgTree(res)
    this.orgObj = this.formatOrgTreeToObj(res)

    await this.formatProjectList()

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
        return null
      }
    },
    async getDetail() {
      if (!this.loading) {
        this.loading = true
        const res = await taskGetDaily(this.info.id)

        this.form = { ...this.info, ...res, ...res.detailViewVO, ...res.taskDetailVO }
        this.loading = false
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
          if (this.taskForm.ifUpload) {
            this.nextTo()
          } else {
            this.remark()
          }
        } else {
          this.loading = false
        }
      })
    },
    async remark() {
      const { businessKey } = this.form
      const { remark } = this.taskForm
      const nowDate = moment().format('YYYY-MM-DD')
      const form = {
        markTime: new Date(nowDate).getTime(),
        taskId: businessKey,
        text: remark
      }

      try {
        await taskAddRemark(form)
        this.$message.success('操作成功')
        this.dialogVisibleHandle = false
        this.loading = false
        this.$EventBus.$emit('view-component-back')
      } catch (e) {
        this.loading = false
        console.error(e)
      }
    },
    //流转
    async nextTo() {
      const { businessKey, taskId } = this.form
      const { ifUpload, remark, userIds, orgIds } = this.taskForm
      const form = {
        ifUpload, // true 流转  false 完成
        businessKey,
        taskId,
        remark
      }

      if (ifUpload) { // 流转带上组织id 或者 用户id
        if (userIds.length) {
          form.assignees = userIds
        } else {
          form.orgIds = orgIds
        }
      }
      try {
        await taskFinish(form)
        this.$message.success('操作成功')
        this.dialogVisibleHandle = false
        // this.$emit('save-success')
        this.loading = false
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
.jc-task {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.jc-footer {
  text-align: center;
  padding: 10px 0;
}
</style>
