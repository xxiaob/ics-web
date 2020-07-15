<template>
  <el-dialog :title="options ? '编辑日常任务' : '新增日常任务'" :visible.sync="dialogVisible" width="1100px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose" top="5vh">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form" size="small">
      <div class="jc-clearboth">
        <el-form-item label="项目名称" prop="projectId" :rules="rules.SELECT_NOT_NULL" class="jc-left-width45">
          <el-cascader v-model="form.projectId" :options="projectList" :props="{expandTrigger:'hover',emitPath:false}" @change="changeProject"></el-cascader>
        </el-form-item>
        <el-form-item label="任务名称" prop="taskName" :rules="rules.Len50" class="jc-right-width45">
          <el-input v-model="form.taskName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
      </div>
      <!-- assigneeAreaPOS -->
      <el-form-item label="任务区域" prop="" :rules="rules.NOT_NULL">
        <jc-task-area :edit.sync="editArea" :projectId="form.projectId" :emergency="emergency" :areaType.sync="form.workAreaType" :selectedAreas.sync="form.assigneeAreaPOS" :orgTree="orgTree"></jc-task-area>
      </el-form-item>
      <!-- peopleProps[peopleType] -->
      <el-form-item label="任务人员" prop="" :rules="rules.SELECT_NOT_NULL">
        <jc-task-people :edit.sync="edit" :projectId="form.projectId" :emergency="emergency" :peopleType.sync="peopleType" :selecteds.sync="peoples" :orgTree="orgTree"></jc-task-people>
      </el-form-item>
      <el-form-item label="任务时间" prop="date" :rules="rules.SELECT_NOT_NULL">
        <el-date-picker style="width:40%" v-model="form.date" @change="changeDate" value-format="timestamp" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务描述" prop="taskDesc" :rules="rules.NOT_NULL">
        <jc-editor v-model="form.taskDesc"></jc-editor>
      </el-form-item>
      <div class="jc-clearboth" v-if="peopleType===TASK_PEOPLE_TYPES.PEOPLE">
        <div class="jc-left-width45">
          <el-form-item label="任务频率" prop="workFrequency" :rules="rules.num" class="workFrequency custom">
            <el-select v-model="workFrequency" clearable placeholder="请选择任务频率" @change="changeWorkFrequency">
              <el-option v-for="item in TASK_FREQUENCYS.VALUES" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input v-model.number="form.workFrequency" placeholder="请输入任务频率" :disabled="workFrequency!=0"></el-input>
            <span>天</span>
          </el-form-item>
        </div>
        <el-form-item label="准点到岗" prop="ifOnTime" :rules="rules.num" class="jc-right-width45">
          <el-switch v-model="form.ifOnTime" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </div>
      <div class="jc-clearboth" v-if="peopleType===TASK_PEOPLE_TYPES.PEOPLE">
        <div class="jc-left-width45">
          <el-form-item label="在岗时长" prop="workTime" :rules="rules.num">
            <el-input v-model.number="form.workTime" placeholder="请输入在岗时长(单位小时)"></el-input>
          </el-form-item>
          <el-form-item label="在岗人数" prop="workPeopleNbr" :rules="rules.num">
            <el-input v-model.number="form.workPeopleNbr" type="number" placeholder="请输入在岗人数"></el-input>
          </el-form-item>
        </div>
        <div class="jc-right-width45">
          <el-form-item label="在岗时间" prop="" :rules="rules.SELECT_NOT_NULL">
            <el-time-picker style="width: 260px;" v-for="(item,index) in taskTimes" v-model="taskTimes[index]" :key="index" value-format="HH:mm:ss" is-range range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
            </el-time-picker>
            <el-button icon="el-icon-close" circle size="mini" title="增加" @click="delTime"></el-button>
            <el-button icon="el-icon-plus" circle size="mini" title="删除" @click="addTime"></el-button>
          </el-form-item>
        </div>
      </div>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(false)" size="small">暂 存</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(true)" size="small">下 发</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { taskSave } from '@/api/task'
// import { userListByOrg } from '@/api/user'
import { getStringRule, getNumberRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { TASK_TYPES, TASK_AREA_TYPES, TASK_PEOPLE_TYPES, PROJECT_TYPES, TASK_FREQUENCYS } from '@/constant/Dictionaries'

const defaultForm = {
  workAreaType: TASK_AREA_TYPES.GRID,
  assigneeAreaPOS: [],
  businessKey: '',
  projectId: '',
  taskName: '',
  beginTime: '',
  endTime: '',
  taskDesc: '',
  orgIds: [],
  userIds: [],
  date: null,
  workTime: null,
  workPeopleNbr: null,
  taskTimePOS: [],
  ifOnTime: 1,
  workFrequency: null
}

export default {
  name: 'TaskProcessManageDaily',
  mixins: [FormMixins],
  props: {
    EmergencySupport: {
      type: Array
    },
    orgObj: {
      type: Object
    },
    projectList: {
      type: Array
    },
    projectListArr: {
      type: Array
    },
    orgTree: {
      type: Array
    },
    orgId: {
      type: String
    }
  },
  components: {
    JcTaskArea: () => import('./taskArea'),
    JcTaskPeople: () => import('../manage/taskPeople'),
    JcEditor: () => import('@/components/JcForm/JcEditor')
  },
  data() {
    return {
      editArea: false,
      edit: false,
      workFrequency: null,
      emergency: false,
      TASK_PEOPLE_TYPES,
      TASK_FREQUENCYS,
      peopleType: TASK_PEOPLE_TYPES.PEOPLE,
      peoples: [],
      peopleProps: {
        [TASK_PEOPLE_TYPES.ORG]: 'orgIds',
        [TASK_PEOPLE_TYPES.PEOPLE]: 'userIds'
      },
      loading: false,
      rules: {
        Len50: getStringRule(1, 50),
        num: getNumberRule(true, null, 0),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      users: [],
      taskTimes: [null]
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
    }
  },
  methods: {
    changeWorkFrequency(val) {
      this.form.workFrequency = val ? val : null
    },
    changeProject(val) {
      const res = this.EmergencySupport.filter(item=>item.value === val)

      this.emergency = res.length ? true : false
      // console.log('changeProject', this.emergency, this.EmergencySupport, val)
    },
    delTime() {
      const len = this.taskTimes.length

      if (len > 1) {
        this.taskTimes.splice(len - 1, 1)
      } else {
        this.$message.warning('不能删除最后一个')
      }
    },
    addTime() {
      this.taskTimes.push(null)
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
      this.editArea = true
      this.edit = true
      if (this.options) {
        const { orgIds, assignees, detailViewVO: { businessKey, projectId, taskDesc, taskName, endDate, startDate }, taskTimePOS, workPeopleNbr, workTime, workAreaType, assigneeAreaPOS, ifOnTime, workFrequency } = this.options

        this.changeProject(projectId)

        const project = this.projectListArr.filter(item=>item.value == projectId)
        const newProjectId = (project[0] && project[0].value) || PROJECT_TYPES.NORMAL

        const form = { businessKey, projectId: newProjectId, taskName, beginTime: startDate, endTime: endDate, taskDesc, date: [startDate, endDate], taskTimePOS, workPeopleNbr, workTime: Number(workTime), workAreaType,
          assigneeAreaPOS: assigneeAreaPOS.map(item=>item.areaId), ifOnTime, workFrequency }

        const res = TASK_FREQUENCYS.VALUES.filter(item=>item.value === workFrequency)

        this.workFrequency = res.length ? workFrequency : 0
        const times = []

        if (taskTimePOS && taskTimePOS.length) {
          taskTimePOS.forEach(item=>{
            if (item) {
              times.push([item.startTime, item.endTime])
            }
          })
        }
        this.taskTimes = times
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
        this.emergency = false
        this.peopleType = TASK_PEOPLE_TYPES.PEOPLE
        this.peoples = []
        this.workFrequency = null
        return { ...defaultForm, projectId: PROJECT_TYPES.NORMAL }
      }
    },
    onSubmit(ifStart) {
      const times = []

      this.taskTimes.forEach(item=>{
        if (item) {
          times.push({
            startTime: item[0],
            endTime: item[1]
          })
        }
      })
      this.form.taskTimePOS = times
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmSave(ifStart)
        } else {
          this.loading = false
        }
      })
    },
    async confirmSave(ifStart) {
      let orgIds = [], userIds = []

      if (this.form.userIds.length) {
        orgIds = []
        userIds = this.form.userIds
      } else {
        orgIds = this.form.orgIds
        userIds = []
      }
      this.form.assigneeAreaPOS = this.form.assigneeAreaPOS.map(item=>({ areaId: item }))
      const form = {
        ifStart,
        optType: TASK_TYPES.DAILY,
        orgIds,
        userIds,
        taskPO: { orgId: this.orgId, ...this.form },
        dailyTaskPO: this.form
      }

      try {
        await taskSave(form)
        this.$message.success('操作成功')
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
// /deep/ .el-dialog__body::after {
//   content: "";
//   display: table;
//   clear: both;
// }
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
.jc-myeditor {
  height: 160px;
  /deep/ .w-e-text-container {
    height: 120px !important;
  }
}
.workFrequency {
  .el-input {
    display: none;
  }
}
.custom {
  .el-input,
  .el-select {
    width: 50%;
    display: block;
    float: left;
  }
  .el-input {
    width: 45%;
  }
}
</style>
