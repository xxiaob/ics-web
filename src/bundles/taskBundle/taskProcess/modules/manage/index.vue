<template>
  <el-dialog :title="options ? '编辑临时任务' : '新增临时任务'" :visible.sync="dialogVisible" width="900px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <div class="jc-clearboth">
        <el-form-item label="项目类型" prop="projectType" :rules="rules.NOT_NULL" class="jc-left-width40">
          <el-input v-model="form.projectType" placeholder="请输入项目类型"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectId" :rules="rules.NOT_NULL" class="jc-left-width60">
          <el-input v-model="form.projectId" placeholder="请输入项目名称"></el-input>
        </el-form-item>
      </div>
      <div class="jc-clearboth">
        <el-form-item label="任务名称" prop="taskName" :rules="rules.Len50" class="jc-left-width40">
          <el-input v-model="form.taskName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="任务时间" prop="date" :rules="rules.NOT_NULL" class="jc-left-width60">
          <el-date-picker style="width:100%" v-model="form.date" @change="changeDate" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="jc-clearboth">
        <el-form-item label="任务位置" prop="taskPositionName" :rules="rules.NOT_NULL" class="jc-left-width40">
          <el-input v-model="form.taskPositionName" placeholder="请输入任务位置"></el-input>
        </el-form-item>
        <el-form-item label="任务来源" prop="taskSource" :rules="rules.SELECT_NOT_NULL" class="jc-left-width60">
          <el-select v-model="form.taskSource" placeholder="选择任务来源" :disabled="taskSourceDisabled">
            <el-option v-for="item in taskSources" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="任务指派" prop="taskPosition" :rules="rules.NOT_NULL">
        <el-input v-model="form.taskPosition" placeholder="请输入任务指派"></el-input>
      </el-form-item>
      <el-form-item label="任务人员" prop="orgIds" :rules="rules.SELECT_NOT_NULL">
        <el-cascader :options="orgTree" v-model="form.orgIds" :props="{expandTrigger: 'hover', emitPath: false, multiple: true ,checkStrictly: true}" clearable placeholder="请选择组织(必填)" :show-all-levels="false" @change="changeOrg" class="jc-left-width50"></el-cascader>
        <el-select v-model="form.userIds" multiple placeholder="请选择人员(选填)" clearable class="jc-left-width50">
          <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述" prop="taskDesc" :rules="rules.NOT_NULL">
        <el-input v-model="form.taskDesc" placeholder="请输入任务描述" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { taskSave } from '@/api/task'
import { userListByOrg } from '@/api/user'
import { questionReport } from '@/api/question'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { TASK_TYPES, TASK_SOURCES } from '@/constant/Dictionaries'

const defaultTaskSourceKeys = TASK_SOURCES.VALUES.map(item=>item.value)

const defaultForm = {
  businessKey: '',
  taskId: '',
  projectId: '',
  projectType: '',
  taskName: '',
  taskSource: '',
  beginTime: '',
  endTime: '',
  taskDesc: '',
  taskPosition: '',
  taskPositionName: '',
  orgIds: [],
  userIds: [],
  date: null
}

export default {
  name: 'TaskProcessManage',
  mixins: [FormMixins],
  props: {
    orgTree: {
      type: Array
    },
    orgId: {
      type: String
    }
  },
  data() {
    return {
      loading: false,
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      users: [],
      taskSources: JSON.parse(JSON.stringify(TASK_SOURCES.VALUES)),
      taskSourceDisabled: false,
      questionForm: {
        ifUpload: false,
        ifClose: false,
        businessKey: '',
        taskId: ''
      }
    }
  },
  created() {
    this.formatQuestionForm()
  },
  methods: {
    formatQuestionForm() {
      const { id, problemTitle, taskId } = this.$route.query

      if (id) {
        this.taskSources.push({ key: id, value: id, label: problemTitle })
        this.form.taskSource = id
        this.questionForm.businessKey = id
        this.questionForm.taskId = taskId
        this.taskSourceDisabled = true
        this.dialogVisible = true
        this.$router.push({ name: 'taskProcess' })
      }
    },
    changeOrg(orgIds) {
      if (orgIds.length) {
        this.getUser(orgIds)
      } else {
        this.users = []
      }
      this.form.userIds = []
    },
    async getUser(orgIds) {
      try {
        const res = await userListByOrg(orgIds)
        const users = []

        if (res && res.length) {
          res.forEach(item=>{
            users.push({
              id: item.userId,
              name: item.userName
            })
          })
        }
        this.users = users
      } catch (error) {
        console.error(error)
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
      const { id } = this.$route.query

      if (!id) {
        this.taskSources = JSON.parse(JSON.stringify(TASK_SOURCES.VALUES))
        this.taskSourceDisabled = false
      }
      if (this.options) {
        // console.log(this.options)
        const { taskId, orgIds, assignees, detailViewVO: { businessKey, projectId, taskDesc, taskName, endDate, startDate }, taskDetailVO: { taskPosition, taskPositionName, taskSource, taskSourceName } } = this.options

        if (taskSourceName) {
          this.taskSourceDisabled = true
          this.taskSources.push({ key: taskSource, value: taskSource, label: taskSourceName })
        }
        const form = {
          businessKey,
          taskId,
          projectId,
          projectType: projectId,
          taskName,
          taskSource,
          beginTime: startDate,
          endTime: endDate,
          taskDesc,
          taskPosition,
          taskPositionName,
          date: [startDate, endDate]
        }

        if (assignees && assignees.length) {
          const userIds = [], UserOrgIds = []

          assignees.forEach(item=>{
            userIds.push(item.userId)
            if (!UserOrgIds.includes(item.orgId)) {
              UserOrgIds.push(item.orgId)
            }
          })
          this.getUser(UserOrgIds)
          form.userIds = userIds
          form.orgIds = UserOrgIds
        } else {
          this.users = []
          form.userIds = []
          form.orgIds = orgIds
        }
        return form
      } else {
        return { ...defaultForm }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmSave()
        } else {
          this.loading = false
        }
      })
    },
    async confirmSave() {
      let orgIds = [], userIds = []

      if (this.form.userIds.length) {
        orgIds = []
        userIds = this.form.userIds
      } else {
        orgIds = this.form.orgIds
        userIds = []
      }
      const form = {
        optType: TASK_TYPES.TEMPORARY,
        orgIds,
        userIds,
        taskPO: { orgId: this.orgId, ...this.form },
        temporaryTaskPO: this.form
      }

      try {
        await taskSave(form)
        console.log(defaultTaskSourceKeys)
        if (!defaultTaskSourceKeys.includes(this.form.taskSource)) {
          questionReport(this.questionForm)
        }
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
</style>
