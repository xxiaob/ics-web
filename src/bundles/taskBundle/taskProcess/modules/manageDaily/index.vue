<template>
  <el-dialog :title="options ? '编辑日常任务' : '新增日常任务'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="项目类型" prop="projectType" :rules="rules.NOT_NULL">
        <el-input v-model="form.projectType" placeholder="请输入项目类型"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectId" :rules="rules.NOT_NULL">
        <el-input v-model="form.projectId" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName" :rules="rules.Len50">
        <el-input v-model="form.taskName" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <!-- <el-form-item label="任务区域" prop="taskPositionName" :rules="rules.NOT_NULL">
        <el-input v-model="form.taskPositionName" placeholder="请输入任务区域"></el-input>
      </el-form-item> -->
      <el-form-item label="任务周期" prop="date" :rules="rules.NOT_NULL">
        <el-date-picker style="width:100%" v-model="form.date" @change="changeDate" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务要求">
        <el-form-item label="在岗时间" prop="taskTimePOS">
          <!-- <el-input v-model="form.taskTimePOS" placeholder="请输入在岗时间"></el-input> -->
        </el-form-item>
        <el-form-item label="在岗时长" prop="workTime" :rules="rules.num">
          <el-input v-model.number="form.workTime" type="number" placeholder="请输入在岗时长"></el-input>
        </el-form-item>
        <el-form-item label="在岗人数" prop="workPeopleNbr" :rules="rules.num">
          <el-input v-model.number="form.workPeopleNbr" type="number" placeholder="请输入在岗人数"></el-input>
        </el-form-item>
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
import { getStringRule, getNumberRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { TASK_TYPES } from '@/constant/Dictionaries'

const defaultForm = {
  businessKey: '',
  projectId: '',
  projectType: '',
  taskName: '',
  beginTime: '',
  endTime: '',
  taskDesc: '',
  orgIds: [],
  userIds: [],
  date: null,
  workTime: '',
  workPeopleNbr: 0,
  taskTimePOS: [
    {
      endTime: '',
      startTime: ''
    }
  ]
}

export default {
  name: 'TaskProcessManageDaily',
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
        num: getNumberRule(false),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      users: []
    }
  },
  methods: {
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
      if (this.options) {
        const { orgIds, assignees, detailViewVO: { businessKey, projectId, taskDesc, taskName, endDate, startDate }, taskDetailVO: { taskPosition, taskPositionName } } = this.options


        const form = {
          businessKey,
          projectId,
          projectType: projectId,
          taskName,
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
.jc-left-width50 {
  width: 50%;
  float: left;
}
</style>
