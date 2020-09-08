<template>
  <el-dialog :title="options ? '编辑临时任务' : '新增临时任务'" :visible.sync="dialogVisible" width="1100px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose" top="1vh">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form" size="small">
      <div class="jc-clearboth">
        <el-form-item label="下发人" class="jc-left-width45">
          <span>{{user.userName}}</span>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectId" :rules="rules.SELECT_NOT_NULL" class="jc-right-width45">
          <el-cascader v-model="form.projectId" :options="projectList" :props="projectCascaderProps" :disabled="!!projectId" @change="changeProject"></el-cascader>
        </el-form-item>
      </div>
      <div class="jc-clearboth">
        <el-form-item label="任务名称" prop="taskName" :rules="rules.Len50" class="jc-left-width45">
          <el-input v-model="form.taskName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="任务时间" prop="date" :rules="rules.NOT_NULL" class="jc-right-width45">
          <el-date-picker style="width:100%" v-model="form.date" @change="changeDate" value-format="timestamp" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="jc-clearboth">
        <el-form-item label="任务位置" prop="taskPosition" :rules="rules.NOT_NULL" class="jc-left-width45">
          <el-input v-model="form.taskPosition" placeholder="请点击地图选择任务位置" style="display:none"></el-input>
          <span>{{form.taskPositionName}}</span>
        </el-form-item>
        <el-form-item label="任务来源" prop="taskSource" :rules="rules.SELECT_NOT_NULL" class="jc-right-width45">
          <el-select v-model="form.taskSource" placeholder="选择任务来源" :disabled="taskSourceDisabled" :class="{'jc-left-width45':taskSourceDisabled}">
            <el-option v-for="item in taskSources" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <div v-show="taskSourceDisabled" class="taskSourceName" :title="taskSourceName">{{taskSourceName}}</div>
        </el-form-item>
      </div>
      <el-form-item label="任务指派">
        <div class="jc-map-tip">右键点击地图选中位置</div>
        <div class="jc-map">
          <map-user-marker v-model="position" @user-change="userChange"></map-user-marker>
        </div>
      </el-form-item>
      <!-- peopleProps[peopleType] -->
      <el-form-item label="任务人员" prop="" :rules="rules.SELECT_NOT_NULL">
        <!-- projectId 后期重写 -->
        <jc-task-people :edit.sync="edit" :projectId="form.projectId==initProjectId?'':form.projectId" :emergency="emergency" :peopleType.sync="peopleType" :selecteds.sync="peoples"></jc-task-people>
      </el-form-item>
      <el-form-item label="任务描述" prop="taskDesc" :rules="rules.NOT_NULL">
        <jc-editor v-model="form.taskDesc"></jc-editor>
      </el-form-item>
      <el-form-item label="附件">
        <upload :show="dialogVisible" :urls.sync="form.uploadFilePaths" accept="*"></upload>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(false)" size="small" v-show="(selectType!=TASK_SELECT_TYPES.ISSUED||!options) && !question">暂 存</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(true)" size="small" v-show="selectType!=TASK_SELECT_TYPES.ISSUED||!options">下 发</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(false)" size="small" v-show="selectType===TASK_SELECT_TYPES.ISSUED&&options">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { taskSave } from '@/api/task'

import FormMixins from '@/mixins/FormMixins'
import projectsMixins from '@/bundles/taskBundle/mixins/projectsMixins'

import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import { TASK_TYPES, TASK_SOURCES, TASK_PEOPLE_TYPES, TASK_SELECT_TYPES, PROJECT_TYPES } from '@/constant/Dictionaries'

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

const defaultForm = {
  businessKey: '',
  taskId: '',
  projectId: '',
  taskName: '',
  taskSource: '',
  taskSourceId: '',
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
  mixins: [FormMixins, projectsMixins],
  props: {
    question: {
      required: false
    },
    projectId: String,
    selectType: {
      type: String
    }
  },
  components: {
    upload: () => import('@/components/JcUpload'),
    JcTaskPeople: () => import('./taskPeople'),
    MapUserMarker: () => import('@/components/JcMap/MapUserMarker'),
    JcEditor: () => import('@/components/JcForm/JcEditor')
  },
  computed: {
    ...mapState(['user']),
    initProjectId() {
      return this.projectList.length ? this.projectList[0].id : ''
    }
  },
  data() {
    return {
      projectCascaderProps: {
        expandTrigger: 'hover',
        emitPath: false,
        children: 'sonProjects',
        label: 'name',
        value: 'id'
      },
      TASK_SELECT_TYPES,
      edit: false,
      taskSourceName: '',
      emergency: false,
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
      taskSources: TASK_SOURCES.VALUES,
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
  created() {
    this.getProjects()
  },
  methods: {
    changeProject(val) {
      const res = this.EmergencySupport.filter(item=>item.id === val)

      this.emergency = res.length ? true : false
    },
    userChange(val) {
      if (this.peopleType === TASK_PEOPLE_TYPES.ORG) {
        this.peoples = val
        this.peopleType = TASK_PEOPLE_TYPES.PEOPLE
      } else {
        this.peoples = [...new Set([...this.peoples, ...val])]
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
      let questionTaskSource = '', paths = [], taskSourceId = '', position = '', positionName = ''

      this.edit = true

      if (this.question) {
        questionTaskSource = TASK_SOURCES.PROBLEMFEEDBACK
        taskSourceId = this.question.value
        paths = this.question.uploadFilePaths
        position = this.question.position
        positionName = this.question.positionName
        this.taskSourceName = this.question.label
        this.taskSourceDisabled = true
      } else {
        this.taskSourceDisabled = false
      }

      if (this.options) {
        // console.log(this.options)
        const { taskId, orgIds, assignees, detailViewVO: { businessKey, projectId, taskDesc, taskName, endDate, startDate }, taskDetailVO: { taskPosition, taskPositionName, taskSource, uploadFilePaths } } = this.options

        this.changeProject(projectId)

        this.position = { position: taskPosition, name: taskPositionName }
        const form = {
          businessKey,
          taskId,
          projectId,
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
        this.position = { position: position, name: positionName }
        this.peopleType = TASK_PEOPLE_TYPES.PEOPLE
        this.peoples = []
        const beginTime = new Date().getTime()
        const endTime = beginTime + 2 * 60 * 60 * 1000

        let newProjectId = this.initProjectId

        this.emergency = false
        if (this.projectId && this.EmergencySupport) {
          newProjectId = this.projectId === PROJECT_TYPES.NORMAL ? this.projectList[0].id : this.projectId
          this.changeProject(newProjectId)
        }

        return { ...defaultForm, taskSource: questionTaskSource, projectId: newProjectId, beginTime, endTime, date: [beginTime, endTime], uploadFilePaths: paths, taskSourceId, taskPosition: position,
          taskPositionName: positionName }
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
/deep/ .el-dialog {
  .el-dialog__body {
    padding: 20px 80px;
    .el-form-item--small.el-form-item {
      margin-bottom: 15px;
    }
  }
  .el-dialog__header {
    padding: 5px 20px;
    .el-dialog__title {
      font-size: 16px;
    }
  }
}
.dialog-footer {
  text-align: center;
}
.jc-left-width45 {
  width: 45%;
  float: left;
}
.jc-right-width45 {
  width: 45%;
  float: right;
}
.jc-clearboth::after,
.jc-clearboth::before {
  content: "";
  display: table;
  clear: both;
}
.taskSourceName {
  width: 52%;
  float: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.jc-map {
  height: 300px;
  position: relative;
}
.jc-map-tip {
  color: red;
  font-size: 12px;
  // position: absolute;
  // top: 5px;
  // left: 5px;
  // z-index: 100;
}
.jc-myeditor {
  height: 160px;
  /deep/ .w-e-text-container {
    height: 120px !important;
  }
}
</style>
