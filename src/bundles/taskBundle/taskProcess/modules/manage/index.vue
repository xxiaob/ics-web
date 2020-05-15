<template>
  <el-dialog :title="options ? options.view?'查看临时任务':'编辑临时任务' : '新增临时任务'" :visible.sync="dialogVisible" width="900px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <div class="jc-clearboth">
        <el-form-item label="项目类型" prop="projectType" :rules="rules.NOT_NULL" class="jc-left-width40">
          <el-input v-model="form.projectType" :disabled="view" placeholder="请输入项目类型"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectId" :rules="rules.NOT_NULL" class="jc-left-width60">
          <el-input v-model="form.projectId" :disabled="view" placeholder="请输入项目名称"></el-input>
        </el-form-item>
      </div>
      <div class="jc-clearboth">
        <el-form-item label="任务名称" prop="taskName" :rules="rules.Len50" class="jc-left-width40">
          <el-input v-model="form.taskName" :disabled="view" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="任务时间" prop="date" :rules="rules.NOT_NULL" class="jc-left-width60">
          <el-date-picker style="width:100%" :disabled="view" v-model="form.date" @change="changeDate" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="jc-clearboth">
        <el-form-item label="任务位置" prop="taskPositionName" :rules="rules.NOT_NULL" class="jc-left-width40">
          <el-input v-model="form.taskPositionName" :disabled="view" placeholder="请输入任务位置"></el-input>
        </el-form-item>
        <el-form-item label="任务来源" prop="taskSource" :rules="rules.NOT_NULL" class="jc-left-width60">
          <el-input v-model="form.taskSource" :disabled="view" placeholder="请输入任务来源"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="任务指派" prop="taskPosition" :rules="rules.NOT_NULL">
        <el-input v-model="form.taskPosition" :disabled="view" placeholder="请输入任务指派"></el-input>
      </el-form-item>
      <el-form-item label="任务人员" prop="orgIds" :rules="rules.SELECT_NOT_NULL">
        <el-cascader :options="orgTree" :disabled="view" v-model="form.orgIds" :props="{expandTrigger: 'hover', emitPath: false, multiple: true ,checkStrictly: true}" clearable placeholder="请选择组织(必填)" :show-all-levels="false" @change="changeOrg" class="jc-left-width50"></el-cascader>
        <el-select v-model="form.userIds" multiple placeholder="请选择人员(选填)" :disabled="view" clearable class="jc-left-width50">
          <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述" prop="taskDesc" :rules="rules.NOT_NULL">
        <el-input v-model="form.taskDesc" :disabled="view" placeholder="请输入任务描述" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="流转记录" v-show="view">
        <div>流转记录</div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-show="!view">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
    <div slot="footer" class="dialog-footer" v-show="handle">
      <el-button @click="handleTask(true)" type="primary">流转任务</el-button>
      <el-button @click="handleTask(false)" type="primary">结束任务</el-button>
    </div>
    <el-dialog :title="taskForm.ifUpload?'流转任务':'结束任务'" :visible.sync="dialogVisibleHandle" width="600px" append-to-body>
      <el-form ref="taskForm" label-width="80px" :model="taskForm" class="jc-manage-form">
        <el-form-item label="任务人员" prop="orgIds" :rules="rules.SELECT_NOT_NULL" v-if="taskForm.ifUpload">
          <el-cascader :options="orgTree" v-model="taskForm.orgIds" :props="{expandTrigger: 'hover', emitPath: false, multiple: true ,checkStrictly: true}" clearable placeholder="请选择组织(必填)" :show-all-levels="false" @change="changeOrg" class="jc-left-width50"></el-cascader>
          <el-select v-model="taskForm.userIds" multiple placeholder="请选择人员(选填)" clearable class="jc-left-width50">
            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件" prop="eventIds" :rules="rules.SELECT_NOT_NULL" v-if="!taskForm.ifUpload">
          <el-select v-model="taskForm.eventIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
            <el-option v-for="item in events" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
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
  </el-dialog>
</template>
<script>
import { taskSave, taskFinish } from '@/api/task'
import { userListByOrg } from '@/api/user'
import { eventManageSelectList } from '@/api/eventManage'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

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
  name: 'SystemTaskProcessManage',
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
      // taskPeople: 'orgIds',
      view: false,
      users: [],
      dialogVisibleHandle: false,
      events: [],
      handle: false,
      taskForm: {
        ifUpload: false,
        remark: '',
        orgIds: [],
        userIds: [],
        eventIds: []
      }
    }
  },
  created() {
    const { id, problemTitle } = this.$route.query

    if (id) {
      this.dialogVisible = true
    }

    this.remoteMethod('')
  },
  methods: {
    changeOrg(orgIds) {
      if (orgIds.length) {
        this.getUser(orgIds)
      } else {
        this.users = []
      }
      if (this.handle) {
        this.taskForm.userIds = []
      } else {
        this.form.userIds = []
      }
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
    async remoteMethod(query) {
      this.loading = true
      try {
        this.events = await eventManageSelectList(query)
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
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
      if (this.options) {
        console.log(this.options)
        const { view, handle, taskId, taskSource, taskPositionName, taskPosition, orgIds, assignees, detailViewVO: { businessKey, projectId, taskDesc, taskName, endDate, startDate } } = this.options

        this.view = view || false
        this.handle = handle || false
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

        if (assignees.length) {
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
        this.view = false
        this.handle = false
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

      if (this.form.userIds) {
        orgIds = []
        userIds = this.form.userIds
      } else {
        orgIds = this.form.orgIds
        userIds = []
      }
      const form = {
        optType: 0,
        orgIds,
        userIds,
        taskPO: { orgId: this.orgId, ...this.form },
        temporaryTaskPO: this.form
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
    },
    handleTask(ifUpload) {
      if (this.$refs.taskForm) {
        this.$refs.taskForm.resetFields()
      }
      this.taskForm.userIds = []
      this.taskForm.ifUpload = ifUpload
      this.dialogVisibleHandle = true
    },
    onSubmitTask() {
      this.loading = true
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          this.nextTo()
        } else {
          this.loading = false
        }
      })
    },
    //流转
    async nextTo() {
      const { businessKey, taskId } = this.form
      const { ifUpload, remark, userIds, orgIds, eventIds } = this.taskForm
      const form = {
        ifUpload, // true 流转  false 完成
        businessKey,
        taskId,
        remark,
        eventIds
      }

      if (ifUpload) { // 流转带上组织id 或者 用户id
        if (userIds.length) {
          form.assignees = userIds
        } else {
          form.orgIds = orgIds
        }
      }
      console.log(form)
      try {
        await taskFinish(form)
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.dialogVisibleHandle = false
        this.$emit('save-success')
        this.loading = false
      } catch (e) {
        this.loading = false
        console.error(e)
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
