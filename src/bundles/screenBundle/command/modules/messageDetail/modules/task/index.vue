<template>
  <div class="jc-task">
    <div class="jc-header">
      <div :class="{activate:activate==='1'}" @click="changeActivate('1')">基础信息</div>
      <div :class="{activate:activate==='2'}" @click="changeActivate('2')">流转记录</div>
      <div :class="{activate:activate==='3'}" @click="changeActivate('3')">备注</div>
    </div>

    <div v-show="activate==='1'" class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <div class="jc-detail-warp">
        <div class="jc-detail-label">任务名称</div>
        <div class="jc-detail-content">{{form.taskName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">创建时间</div>
        <div class="jc-detail-content">{{form.createDate|filterTime}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">项目名称</div>
        <div class="jc-detail-content">{{form.projectName}}</div>
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
    <div v-show="activate==='2'" class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <jc-forward-list :taskId="form.businessKey" ref="forward"></jc-forward-list>
    </div>
    <div v-show="activate==='3'" class="jc-view-content jc-remark" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <jc-remark-list :taskId="form.businessKey" ref="remark" :small="true"></jc-remark-list>
    </div>
    <div class="jc-footer" v-show="activate==='1'">
      <el-button @click="handleTask(true)" size="small" type="primary">流转任务</el-button>
      <el-button @click="handleTask(false)" size="small" type="primary">添加备注</el-button>
      <el-button @click="sendScreen" type="primary" size="small">{{isSendScreen?'关闭投屏':'投屏'}}</el-button>
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
import { organizationList } from '@/api/organization'
import { TASK_PEOPLE_TYPES, MESSAGE_DATA_TYPES } from '@/constant/Dictionaries'
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
    JcTaskPeople: () => import('@/bundles/taskBundle/taskProcess/modules/manage/taskPeople'),
    JcForwardList: () => import('@/bundles/taskBundle/taskProcess/modules/detail/forwardList'),
    JcRemarkList: () => import('@/bundles/taskBundle/taskProcess/modules/detailDaily/remarkList')
  },
  data() {
    return {
      activate: '1',
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
      rules: {
        SELECT_NOT_NULL,
        NOT_NULL
      },
      taskForm: {
        ifUpload: false,
        remark: '',
        orgIds: [],
        userIds: []
      },
      isSendScreen: false
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
    sendScreen() {
      if (this.isSendScreen) {
        this.isSendScreen = false
        this.$EventBus.$emit('screen-message-channel', { type: MESSAGE_DATA_TYPES.CLOSR, closeType: MESSAGE_DATA_TYPES.TASK })
        this.$message.success('关闭投屏成功')
      } else {
        this.isSendScreen = true
        this.$EventBus.$emit('screen-message-channel', { type: MESSAGE_DATA_TYPES.TASK, data: { id: this.info.id } })
        this.$message.success('投屏发送成功')
      }
    },
    changeActivate(val) {
      this.activate = val
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
    async getDetail() {
      if (!this.loading) {
        this.loading = true
        try {
          const res = await taskGetDaily(this.info.id)

          this.form = { ...this.info, ...res, ...res.detailViewVO, ...res.taskDetailVO }
          this.loading = false
        } catch (error) {
          this.form = { ...this.info }
          this.loading = false
        }
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

.jc-header {
  display: flex;
  padding: 5px 0;
  border-bottom: 1px solid #cccccc;
  & > div {
    flex: 1;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
  }
  & > div:not(:last-child) {
    border-right: 1px solid #cccccc;
  }
  .activate {
    color: $jc-color-primary;
  }
}

.jc-remark {
  padding: 10px;
}

.el-textarea /deep/ textarea {
  font-family: "微软雅黑", "Microsoft Yahei", "Helvetica Naue", Helvetica,
    sans-serif !important;
}
</style>
