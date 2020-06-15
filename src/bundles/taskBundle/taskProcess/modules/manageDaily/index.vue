<template>
  <el-dialog :title="options ? '编辑日常任务' : '新增日常任务'" :visible.sync="dialogVisible" width="1100px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose" top="5vh">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="项目名称" prop="projectId" :rules="rules.SELECT_NOT_NULL" class="jc-left-width50">
        <el-cascader v-model="form.projectId" :options="projectList" :props="{expandTrigger:'hover',emitPath:false}"></el-cascader>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName" :rules="rules.Len50" class="jc-left-width50">
        <el-input v-model="form.taskName" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="任务区域" prop="assigneeAreaPOS" :rules="rules.NOT_NULL" class="jc-left-width50">
        <jc-task-area :areaType.sync="form.workAreaType" :selectedAreas.sync="form.assigneeAreaPOS" :orgTree="orgTree"></jc-task-area>
      </el-form-item>
      <el-form-item label="任务人员" prop="" :rules="rules.SELECT_NOT_NULL" class="jc-left-width50">
        <jc-task-people :peopleType.sync="peopleType" :selecteds.sync="peoples" :orgTree="orgTree"></jc-task-people>
      </el-form-item>
      <div label="任务要求" class="jc-left-width50">
        <el-form-item label="任务周期" prop="date" :rules="rules.SELECT_NOT_NULL">
          <el-date-picker v-model="form.date" @change="changeDate" value-format="timestamp" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="在岗时间" prop="taskTimePOS" :rules="rules.SELECT_NOT_NULL">
          <el-date-picker style="width: 300px;" v-for="(item,index) in taskTimes" v-model="taskTimes[index]" :key="index" value-format="HH:mm:ss" format="HH:mm:ss" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
          </el-date-picker>
          <el-button icon="el-icon-close" circle size="mini" title="增加" @click="delTime"></el-button>
          <el-button icon="el-icon-plus" circle size="mini" title="删除" @click="addTime"></el-button>
        </el-form-item>
        <el-form-item label="在岗时长" prop="workTime" :rules="rules.NOT_NULL">
          <el-input v-model="form.workTime" placeholder="请输入在岗时长(单位小时)"></el-input>
        </el-form-item>
        <el-form-item label="在岗人数" prop="workPeopleNbr" :rules="rules.num">
          <el-input v-model.number="form.workPeopleNbr" type="number" placeholder="请输入在岗人数"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="任务描述" prop="taskDesc" :rules="rules.NOT_NULL" class="jc-left-width50">
        <!-- <el-input v-model="form.taskDesc" placeholder="请输入任务描述" type="textarea"></el-input> -->
        <jc-editor v-model="form.taskDesc"></jc-editor>
      </el-form-item>
      <div></div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(false)">暂 存</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(true)">下 发</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { taskSave } from '@/api/task'
// import { userListByOrg } from '@/api/user'
import { getStringRule, getNumberRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { TASK_TYPES, TASK_AREA_TYPES, TASK_PEOPLE_TYPES } from '@/constant/Dictionaries'

const defaultForm = {
  workAreaType: TASK_AREA_TYPES.ORG,
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
  workTime: 0,
  workPeopleNbr: 0,
  taskTimePOS: []
}

export default {
  name: 'TaskProcessManageDaily',
  mixins: [FormMixins],
  props: {
    orgObj: {
      type: Object
    },
    projectList: {
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
      peopleType: TASK_PEOPLE_TYPES.ORG,
      peoples: [],
      loading: false,
      rules: {
        Len50: getStringRule(1, 50),
        num: getNumberRule(false),
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
      if (this.options) {
        const { orgIds, assignees, detailViewVO: { businessKey, projectId, taskDesc, taskName, endDate, startDate }, taskTimePOS, workPeopleNbr, workTime, workAreaType, assigneeAreaPOS } = this.options


        const form = { businessKey, projectId, taskName, beginTime: startDate, endTime: endDate, taskDesc, date: [startDate, endDate], taskTimePOS, workPeopleNbr, workTime, workAreaType,
          assigneeAreaPOS: assigneeAreaPOS.map(item=>item.areaId) }

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
        this.peopleType = TASK_PEOPLE_TYPES.ORG
        this.peoples = []
        return { ...defaultForm }
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
/deep/ .el-dialog__body::after {
  content: "";
  display: table;
  clear: both;
}
.jc-left-width50 {
  width: 50%;
  float: left;
}
.jc-myeditor {
  height: 200px;
  /deep/ .w-e-text-container {
    height: 160px !important;
  }
}
</style>
