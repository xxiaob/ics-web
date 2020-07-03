<template>
  <el-dialog :title="options ? '编辑临时任务' : '新增临时任务'" :visible.sync="dialogVisible" width="1100px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose" top="1vh">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <div class="jc-clearboth">
        <el-form-item label="下发人" class="jc-left-width50">
          <span>{{user.userName}}</span>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectId" :rules="rules.SELECT_NOT_NULL" class="jc-left-width50">
          <el-cascader v-model="form.projectId" :options="projectList" :props="{expandTrigger:'hover',emitPath:false}" :disabled="!!projectId"></el-cascader>
        </el-form-item>
      </div>
      <div class="jc-clearboth">
        <el-form-item label="任务名称" prop="taskName" :rules="rules.Len50" class="jc-left-width50">
          <el-input v-model="form.taskName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="任务时间" prop="date" :rules="rules.NOT_NULL" class="jc-left-width50">
          <el-date-picker style="width:100%" v-model="form.date" @change="changeDate" value-format="timestamp" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="jc-clearboth">
        <el-form-item label="任务位置" prop="taskPosition" :rules="rules.NOT_NULL" class="jc-left-width50">
          <el-input v-model="form.taskPosition" placeholder="请点击地图选择任务位置" style="display:none"></el-input>
          <!-- <el-input v-model="form.taskPositionName" placeholder="请输入任务位置" disabled=""></el-input> -->
          <span>{{form.taskPositionName}}</span>
        </el-form-item>
        <el-form-item label="任务来源" prop="taskSource" :rules="rules.SELECT_NOT_NULL" class="jc-left-width50">
          <el-select v-model="form.taskSource" placeholder="选择任务来源" :disabled="taskSourceDisabled">
            <el-option v-for="item in taskSources" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="jc-clearboth">
        <div class="jc-left-width50">
          <div style="color:red">右键点击地图选中位置</div>
          <div class="jc-map">
            <map-user-marker v-model="position" @user-change="userChange"></map-user-marker>
          </div>
        </div>
        <!-- peopleProps[peopleType] -->
        <el-form-item label="任务人员" prop="" :rules="rules.SELECT_NOT_NULL" class="jc-left-width50">
          <jc-task-people :peopleType.sync="peopleType" :selecteds.sync="peoples" :orgTree="orgTree"></jc-task-people>
        </el-form-item>
      </div>
      <!-- <el-form-item label="任务指派" prop="taskPositionName" :rules="rules.NOT_NULL">
        <el-input v-model="form.taskPositionName" placeholder="请输入任务指派"></el-input>
      </el-form-item> -->
      <div class="jc-clearboth">
        <el-form-item label="任务描述" prop="taskDesc" :rules="rules.NOT_NULL" class="jc-left-width50">
          <!-- <el-input v-model="form.taskDesc" placeholder="请输入任务描述" type="textarea"></el-input> -->
          <jc-editor v-model="form.taskDesc"></jc-editor>
        </el-form-item>
        <el-form-item label="附件" class="jc-left-width50">
          <upload :show="dialogVisible" :urls.sync="form.uploadFilePaths" accept="*"></upload>
        </el-form-item>
      </div>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(false)" v-if="!question">暂 存</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(true)">下 发</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { taskSave } from '@/api/task'
import { organizationList } from '@/api/organization'
import { projectsList } from '@/api/projects'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { TASK_TYPES, TASK_SOURCES, TASK_PEOPLE_TYPES, PROJECT_TYPES } from '@/constant/Dictionaries'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

const defaultForm = {
  businessKey: '',
  taskId: '',
  projectId: '',
  // projectType: '',
  taskName: '',
  taskSource: '',
  beginTime: '',
  endTime: '',
  taskDesc: '',
  taskPosition: '',
  taskPositionName: '',
  orgIds: [],
  userIds: [],
  date: null,
  uploadFilePaths: []
}

export default {
  name: 'TaskProcessManage',
  mixins: [FormMixins],
  props: {
    question: {
      required: false
    },
    projectId: String
  },
  components: {
    upload: () => import('@/components/JcUpload'),
    JcTaskPeople: () => import('./taskPeople'),
    MapUserMarker: () => import('@/components/JcMap/MapUserMarker'),
    JcEditor: () => import('@/components/JcForm/JcEditor')
  },
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      projectListArr: [],
      projectList: [],
      peopleType: TASK_PEOPLE_TYPES.PEOPLE,
      peopleProps: {
        [TASK_PEOPLE_TYPES.ORG]: 'orgIds',
        [TASK_PEOPLE_TYPES.PEOPLE]: 'userIds'
      },
      peoples: [],
      loading: false,
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      orgTree: [],
      taskSources: JSON.parse(JSON.stringify(TASK_SOURCES.VALUES)),
      taskSourceDisabled: false,
      position: {}
    }
  },
  watch: {
    peoples: {
      handler(val) {
        if (this.peopleType === TASK_PEOPLE_TYPES.ORG) {
          this.form.userIds = []
          this.form.orgIds = val
        } else {
          this.form.userIds = val
          this.form.orgIds = []
        }
      },
      deep: true
    },
    position: {
      handler(val) {
        this.form.taskPosition = val.position
        this.form.taskPositionName = val.name
      },
      deep: true
    }
  },
  async created() {
    const res = await organizationList()

    this.orgTree = this.formatOrgTree(res)
    await this.formatProjectList()
  },
  methods: {
    userChange(val) {
      if (this.peopleType === TASK_PEOPLE_TYPES.ORG) {
        this.peoples = val
        this.peopleType = TASK_PEOPLE_TYPES.PEOPLE
      } else {
        this.peoples = [...new Set([...this.peoples, ...val])]
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

      this.projectList = PROJECT_TYPES.VALUES.map(item=>{
        const { value, label, key } = item

        return { value, label, children: this[key] || null }
      })
    },
    async getProjectList(projectType) {
      const res = await projectsList({ projectType })

      if (res && res.length) {
        return res.map(item=>({ value: item.projectId, label: item.projectName }))
      } else {
        return null
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
    formatQuestionForm() {
      const { id, problemTitle } = this.$route.query

      if (id) {
        this.taskSources.push({ key: id, value: id, label: problemTitle })
        this.form.taskSource = id
        this.taskSourceDisabled = true
      }
    },
    changeDate(value) {
      if (value) {
        this.form.beginTime = value[0]
        this.form.endTime = value[1]
      } else {
        this.form.beginTime = ''
        this.form.endTime = ''
      }
    },
    formatFormData() {
      let questionTaskSource = ''

      if (this.question) {
        this.taskSources.push(this.question) // bug 避免重复push  - 判断是否存在
        questionTaskSource = this.question.value
        this.taskSourceDisabled = true
      } else {
        this.taskSources = JSON.parse(JSON.stringify(TASK_SOURCES.VALUES))
        this.taskSourceDisabled = false
      }

      if (this.options) {
        // console.log(this.options)
        const { taskId, orgIds, assignees, detailViewVO: { businessKey, projectId, taskDesc, taskName, endDate, startDate }, taskDetailVO: { taskPosition, taskPositionName, taskSource, uploadFilePaths } } = this.options

        const project = this.projectListArr.filter(item=>item.value == projectId)
        const newProjectId = (project[0] && project[0].value) || PROJECT_TYPES.NORMAL

        this.position = { position: taskPosition, name: taskPositionName }
        const form = {
          businessKey,
          taskId,
          projectId: newProjectId,
          // projectType: projectId,
          taskName,
          taskSource,
          beginTime: startDate,
          endTime: endDate,
          taskDesc,
          taskPosition,
          taskPositionName,
          date: [startDate, endDate],
          uploadFilePaths
        }

        if (assignees && assignees.length) {
          const userIds = assignees.map(item=>item.userId)

          form.userIds = userIds
          form.orgIds = []
          this.peopleType = TASK_PEOPLE_TYPES.PEOPLE
          this.peoples = userIds
        } else {
          form.userIds = []
          form.orgIds = orgIds
          this.peopleType = TASK_PEOPLE_TYPES.ORG
          this.peoples = orgIds
        }
        return form
      } else {
        this.position = {}
        this.peopleType = TASK_PEOPLE_TYPES.PEOPLE
        this.peoples = []
        const beginTime = new Date().getTime()
        const endTime = beginTime + 2 * 60 * 60 * 1000

        let newProjectId = this.projectId

        if (this.projectId && this.projectListArr && this.projectListArr.length) {
          const project = this.projectListArr.filter(item=>item.value == this.projectId)

          newProjectId = (project[0] && project[0].value) || PROJECT_TYPES.NORMAL
        } else {
          newProjectId = PROJECT_TYPES.NORMAL
        }
        return { ...defaultForm, taskSource: questionTaskSource, projectId: newProjectId, beginTime, endTime, date: [beginTime, endTime] }
      }
    },
    onSubmit(ifStart) {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveTask(ifStart)
        } else {
          this.loading = false
        }
      })
    },
    async saveTask(ifStart) {
      let orgIds = [], userIds = []

      if (this.form.userIds.length) {
        orgIds = []
        userIds = this.form.userIds
      } else {
        orgIds = this.form.orgIds
        userIds = []
      }
      const form = {
        ifStart,
        optType: TASK_TYPES.TEMPORARY,
        orgIds,
        userIds,
        taskPO: { orgId: this.user.orgId, ...this.form },
        temporaryTaskPO: this.form
      }

      try {
        await taskSave(form)
        if (!this.question) {
          this.$message.success('操作成功')
        }
        this.dialogVisible = false
        this.$emit('save-success')
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-left-width50 {
  width: 50%;
  float: left;
}
.jc-left-width40 {
  width: 40%;
  float: left;
}
.jc-left-width60 {
  width: 60%;
  float: left;
}
.jc-clearboth::after,
.jc-clearboth::before {
  content: "";
  display: table;
  clear: both;
}
.jc-map {
  height: 300px;
}
.jc-myeditor {
  height: 200px;
  /deep/ .w-e-text-container {
    height: 160px !important;
  }
}
</style>
