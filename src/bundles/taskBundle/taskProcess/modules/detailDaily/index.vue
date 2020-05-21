<template>
  <div>
    <div class="jc-card-title">{{form.handle?'日常任务处理':'日常任务详情'}}</div>
    <el-card class="jc-table-card jc-mt">
      <div slot="header">
        <div class="jc-title">基础信息</div>
      </div>
      <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form" size="mini">
        <div class="jc-clearboth">
          <el-form-item label="任务名称" class="jc-left-width25">
            <span>{{form.taskName}}</span>
          </el-form-item>
          <el-form-item label="创建时间" class="jc-left-width25">
            <span>{{form.createTime|filterTime}}</span>
          </el-form-item>
          <el-form-item label="项目类型" class="jc-left-width25">
            <span>{{form.projectType}}</span>
          </el-form-item>
          <el-form-item label="项目名称" class="jc-left-width25">
            <span>{{form.projectName}}</span>
          </el-form-item>
        </div>
        <div class="jc-clearboth">
          <el-form-item label="任务周期" class="jc-left-width50">
            <span>{{form.startDate|filterTime}} - {{form.endDate|filterTime}}</span>
          </el-form-item>
          <el-form-item label="任务类型" class="jc-left-width25">
            <span>{{form.taskTypeName}}</span>
          </el-form-item>
          <el-form-item label="任务状态" class="jc-left-width25">
            <span>{{form.taskStatusName}}</span>
          </el-form-item>
        </div>
        <div class="jc-clearboth">
          <el-form-item label="下发组织" class="jc-left-width25">
            <span>{{form.startOrg}}</span>
          </el-form-item>
          <el-form-item label="下发人" class="jc-left-width25">
            <span>{{form.startUser}}</span>
          </el-form-item>
          <el-form-item label="任务人员" class="jc-left-width50">
            {{formatUsers}}
          </el-form-item>
        </div>
        <el-form-item label="任务要求">
          <el-form-item label="在岗时间" style="white-space: pre-line;">{{form.taskTimePOS|filterTimePos}}</el-form-item>
          <el-form-item label="在岗时长">
            {{form.workTime}}
          </el-form-item>
          <el-form-item label="在岗人数">
            {{form.workPeopleNbr}}
          </el-form-item>
        </el-form-item>
        <el-form-item label="任务描述">
          {{form.taskDesc}}
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="jc-table-card jc-mt">
      <div slot="header">
        <div class="jc-title">任务备注</div>
      </div>
      <jc-remark-list :taskId="form.businessKey" ref="remark"></jc-remark-list>
    </el-card>
    <div class="jc-detail-footer">
      <el-button @click="handleTask(true)" size="small" v-if="form.handle">流转任务</el-button>
      <el-button @click="handleTask(false)" size="small" v-if="form.handle">添加备注</el-button>
      <el-button size="small" type="primary" @click="$emit('update:dailyDetailShow', false)">返回</el-button>
    </div>
    <el-dialog :title="taskForm.ifUpload?'流转任务':'添加备注'" :visible.sync="dialogVisibleHandle" width="600px" append-to-body>
      <el-form ref="taskForm" label-width="80px" :model="taskForm" class="jc-manage-form">
        <el-form-item label="任务人员" prop="orgIds" :rules="rules.SELECT_NOT_NULL" v-if="taskForm.ifUpload">
          <el-cascader :options="orgTree" v-model="taskForm.orgIds" :props="{expandTrigger: 'hover', emitPath: false, multiple: true ,checkStrictly: true}" clearable placeholder="请选择组织(必填)" :show-all-levels="false" @change="changeOrg" class="jc-left-width50"></el-cascader>
          <el-select v-model="taskForm.userIds" multiple placeholder="请选择人员(选填)" clearable class="jc-left-width50">
            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id">
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
  </div>
</template>
<script>
import { taskFinish, taskAddRemark } from '@/api/task'
import { userListByOrg } from '@/api/user'
import { NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import { formatDate } from '@/libs/util'
import moment from 'moment'

export default {
  name: 'TaskProcessDetailDaily',
  props: {
    info: {
      type: Object,
      default: ()=>{}
    },
    orgTree: {
      type: Array
    },
    orgObj: {
      type: Object
    }
  },
  components: {
    JcRemarkList: () => import('./remarkList')
  },
  data() {
    return {
      loading: false,
      dialogVisibleHandle: false,
      events: [],
      users: [],
      handle: false,
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
  computed: {
    form() {
      if (this.info) {
        return { ...this.info, ...this.info.detailViewVO, ...this.info.taskDetailVO }
      } else {
        return {}
      }
    },
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
    }
  },
  filters: {
    filterTime(value) {
      return formatDate(value)
    },
    filterTimePos(value) {
      if (value) {
        const times = value.map(item=>`${formatDate(item.startTime)} - ${formatDate(item.endTime)}`)

        return times.join('\n')
      } else {
        return ''
      }
    }
  },
  methods: {
    changeOrg(orgIds) {
      if (orgIds.length) {
        this.getUser(orgIds)
      } else {
        this.users = []
      }
      this.taskForm.userIds = []
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
        this.$refs.remark.initData()
        // this.$emit('save-success')
        // this.$emit('update:dailyDetailShow', false)
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
        this.dialogVisible = false
        this.dialogVisibleHandle = false
        this.$emit('save-success')
        this.loading = false
        this.$emit('update:dailyDetailShow', false)
      } catch (e) {
        this.loading = false
        console.error(e)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card /deep/ .el-card__header {
  border: none;
}
.jc-title {
  color: $jc-color-primary;
}
.jc-detail-footer {
  text-align: center;
  margin-top: $jc-default-dis;
}
.jc-left-width50 {
  width: 50%;
  float: left;
}
.jc-left-width25 {
  width: 25%;
  float: left;
}
.jc-clearboth::after,
.jc-clearboth::before {
  content: "";
  display: table;
  clear: both;
}
.el-form .el-form-item {
  margin-bottom: 10px;
}
</style>
