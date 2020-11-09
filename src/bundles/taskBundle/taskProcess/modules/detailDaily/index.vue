<template>
  <div>
    <div class="jc-card-title">{{form.handle?'日常任务处理':'日常任务详情'}}</div>
    <el-card class="jc-table-card jc-mt">
      <div slot="header">
        <div class="jc-title">基础信息</div>
      </div>
      <el-form ref="form" label-width="90px" :model="form" class="jc-manage-form" size="mini">
        <div class="jc-clearboth">
          <el-form-item label="任务名称：" class="jc-left-width25">
            <span>{{form.taskName}}</span>
          </el-form-item>
          <el-form-item label="创建时间：" class="jc-left-width25">
            <span>{{form.createDate|filterTime}}</span>
          </el-form-item>
          <el-form-item label="项目名称：" class="jc-left-width50">
            <span>{{form.projectName}}</span>
          </el-form-item>
        </div>
        <div class="jc-clearboth">
          <el-form-item label="任务周期：" class="jc-left-width50">
            <span>{{form.startDate|filterDate}} - {{form.endDate|filterDate}}</span>
          </el-form-item>
          <el-form-item label="任务类型：" class="jc-left-width25">
            <span>{{form.taskTypeName}}</span>
          </el-form-item>
          <el-form-item label="任务状态：" class="jc-left-width25">
            <span>{{form.taskStatusName}}</span>
          </el-form-item>
        </div>
        <div class="jc-clearboth">
          <el-form-item label="下发组织：" class="jc-left-width25">
            <span>{{form.startOrg}}</span>
          </el-form-item>
          <el-form-item label="下发人：" class="jc-left-width25">
            <span>{{form.startUser}}</span>
          </el-form-item>
          <el-form-item label="任务人员：" class="jc-left-width50">
            {{formatUsers}}
          </el-form-item>
        </div>
        <div class="jc-clearboth" v-show="form.assignees && form.assignees.length">
          <el-form-item label="任务要求：" class="jc-left-width50">
            <el-form-item label="在岗时间：" style="white-space: pre-line;">{{form.taskTimePOS|filterTimePos}}</el-form-item>
            <el-form-item label="在岗时长：">
              {{form.workTime}} 小时
            </el-form-item>
            <el-form-item label="在岗人数：">
              {{form.workPeopleNbr}}
            </el-form-item>
          </el-form-item>
          <el-form-item label="任务频率：" class="jc-left-width25">
            <span>{{formatWorkFrequency}}</span>
          </el-form-item>
          <el-form-item label="准点到岗：" class="jc-left-width25">
            <span>{{form.ifOnTime?'是':'否'}}</span>
          </el-form-item>
        </div>
        <el-form-item label="任务描述：">
          <div v-html="form.taskDesc"></div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="jc-table-card jc-mt">
      <div slot="header">
        <div class="jc-title">流转记录</div>
      </div>
      <jc-forward-list :taskId="form.businessKey" ref="forward"></jc-forward-list>
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
      <el-button size="small" type="primary" @click="downloadDetail">报表下载</el-button>
      <el-button size="small" type="primary" @click="$emit('update:dailyDetailShow', false)">返回</el-button>
    </div>
    <el-dialog :title="taskForm.ifUpload?'流转任务':'添加备注'" :visible.sync="dialogVisibleHandle" :close-on-click-modal="false" width="600px" append-to-body>
      <el-form ref="taskForm" label-width="80px" :model="taskForm" class="jc-manage-form" size="mini">
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
import { taskFinish, taskAddRemark, exportDailyDetailExport } from '@/api/task'
import { NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import { formatDate } from '@/libs/util'
import moment from 'moment'
import { TASK_PEOPLE_TYPES, TASK_FREQUENCYS } from '@/constant/Dictionaries'

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
    JcRemarkList: () => import('./remarkList'),
    JcForwardList: () => import('../detail/forwardList'),
    JcTaskPeople: () => import('../manage/taskPeople')
  },
  data() {
    return {
      peopleType: TASK_PEOPLE_TYPES.PEOPLE,
      peoples: [],
      peopleProps: {
        [TASK_PEOPLE_TYPES.ORG]: 'orgIds',
        [TASK_PEOPLE_TYPES.PEOPLE]: 'userIds'
      },
      loading: false,
      dialogVisibleHandle: false,
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
  methods: {
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
        this.$refs.remark.initData()
        this.$refs.forward.initData()
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
        this.$refs.forward.initData()
        this.$emit('update:dailyDetailShow', false)
      } catch (e) {
        this.loading = false
        console.error(e)
      }
    },
    downloadDetail() {
      console.log('downloadDetail')
      exportDailyDetailExport(this.form.businessKey)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form /deep/ .el-form-item {
  margin-bottom: 0;
}
.jc-mb {
  margin-bottom: 22px !important;
}
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
.el-textarea /deep/ textarea {
  font-family: "微软雅黑", "Microsoft Yahei", "Helvetica Naue", Helvetica,
    sans-serif !important;
}
</style>
