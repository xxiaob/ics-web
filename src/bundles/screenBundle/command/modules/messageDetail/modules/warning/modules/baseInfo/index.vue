<template>
  <div class="jc-warning">

    <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <div class="jc-detail-warp">
        <div class="jc-detail-label">告警类型</div>
        <div class="jc-detail-content">{{form.alarmTypeName}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">企业</div>
        <div class="jc-detail-content">{{form.transportCompany}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">企业地址</div>
        <div class="jc-detail-content">{{form.transportCompanyAddress}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">车牌号</div>
        <div class="jc-detail-content">{{form.carNumber}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">时间</div>
        <div class="jc-detail-content">{{form.alarmDate}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">车速</div>
        <div class="jc-detail-content">{{form.carSpeed}}</div>
      </div>
      <div class="jc-detail-warp">
        <div class="jc-detail-label">状态</div>
        <div class="jc-detail-content">{{formatStatus(form.status)}}</div>
      </div>
    </div>

    <div class="jc-footer">
      <el-button @click="generateTask" :loading="loading" type="primary" size="small">生成任务</el-button>
      <el-button @click="closeQuestion" :loading="loading" size="small">关闭告警</el-button>
      <el-button style="margin-top: 10px;" @click="sendScreen" type="primary" size="small">{{isSendScreen?'关闭投屏':'投屏'}}</el-button>
    </div>

    <task-manage :question="question" :visible.sync="TaskManageShow" @save-success="generateTaskSuccess"></task-manage>

  </div>

</template>
<script>
import { getAlarmById, closeAlarm, updateAlarm } from '@/api/dregsAlarm'
import { MESSAGE_DATA_TYPES, ALARM_STATUS, TASK_SOURCES } from '@/constant/Dictionaries'

export default {
  name: 'ScreenCommandMessageDetailWarningBaseInfo',
  props: {
    info: {
      type: Object,
      default: ()=>{}
    }
  },
  components: {
    TaskManage: () => import('@/bundles/taskBundle/taskProcess/modules/manage')
  },
  data() {
    return {
      loading: false,
      form: {},
      question: null,
      TaskManageShow: false,
      isSendScreen: false
    }
  },
  watch: {
    info: {
      deep: true,
      handler() {
        if (this.info && this.info.id) {
          this.getDetail()
        }
      }
    }
  },
  async created() {
    if (this.info && this.info.id) {
      this.getDetail()
    }
  },
  methods: {
    sendScreen() {
      if (this.isSendScreen) {
        this.isSendScreen = false
        this.$EventBus.$emit('screen-message-channel', { type: MESSAGE_DATA_TYPES.CLOSR, closeType: MESSAGE_DATA_TYPES.QUESTION })
        this.$message.success('关闭投屏成功')
      } else {
        this.isSendScreen = true
        this.$EventBus.$emit('screen-message-channel', { type: MESSAGE_DATA_TYPES.QUESTION, data: { ...this.info } })
        this.$message.success('投屏发送成功')
      }
    },
    async getDetail() {
      if (!this.loading) {
        this.loading = true
        try {
          const res = await getAlarmById(this.info.id)

          this.form = { ...res }
          this.loading = false
        } catch (error) {
          this.form = {}
          this.loading = false
        }
      }
    },
    formatStatus(value) {
      return ALARM_STATUS.toString(value)
    },
    //生成任务
    async generateTask() {
      const { id, alarmTypeName } = this.form

      this.question = {
        value: id,
        label: alarmTypeName,
        questionTaskSource: TASK_SOURCES.RESIDUEWARING
      }
      this.TaskManageShow = true
    },
    //成功生成任务后的回调
    async generateTaskSuccess() {
      this.loading = true
      try {
        await updateAlarm({ id: this.form.id })
        this.$message.success('操作成功')
        this.loading = false
        this.getDetail()
        this.$EventBus.$emit('view-component-back')
      } catch (e) {
        this.loading = false
        console.error(e)
      }
    },
    //关闭告警
    closeQuestion() {
      this.$confirm('确认关闭告警', '提示', { type: 'warning' }).then(async () => {
        this.loading = true
        try {
          await closeAlarm({ id: this.form.id })
          this.$message.success('操作成功')
          this.loading = false
          this.getDetail()
          this.$EventBus.$emit('view-component-back')
        } catch (e) {
          this.loading = false
          console.error(e)
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-warning {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.jc-footer {
  text-align: center;
  padding: 10px 0;
}
</style>
