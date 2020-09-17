<template>
  <div>
    <el-card class="jc-table-card">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">{{form&&form.handle?'处理问题':'问题详情'}}</div>
        <div class="jc-button-group">
          <el-button size="small" icon="el-icon-arrow-left" @click="$emit('update:detailShow', false)">返回</el-button>
        </div>
      </div>
      <div class="jc-detail">
        <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form" size="small">

          <el-form-item label="告警类型：">
            <span>{{form.alarmTypeName}}</span>
          </el-form-item>
          <el-form-item label="企业：">
            <span>{{form.transportCompany}}</span>
          </el-form-item>
          <el-form-item label="企业地址：">
            <span>{{form.transportCompanyAddress}}</span>
          </el-form-item>

          <el-form-item label="车牌号：">
            <span>{{form.carNumber}}</span>
          </el-form-item>
          <el-form-item label="时间：">
            <span>{{form.alarmDate}}</span>
          </el-form-item>
          <el-form-item label="车速：">
            <span>{{form.carSpeed}}</span>
          </el-form-item>
          <el-form-item label="状态：">
            <span>{{ ALARM_STATUS.toString(form.status) }}</span>
          </el-form-item>

        </el-form>
        <div class="jc-detail-footer">
          <el-button v-if="form.handle && form.status == ALARM_STATUS.NO_RESOLVE" @click="generateTask" :loading="loading" type="primary" size="small">生成任务</el-button>
          <el-button v-if="form.handle && form.status == ALARM_STATUS.NO_RESOLVE" @click="closeWarning" :loading="loading" size="small">关闭告警</el-button>
        </div>

        <task-manage :question="question" :visible.sync="TaskManageShow" @save-success="generateTaskSuccess"></task-manage>
      </div>
    </el-card>
    <jc-task v-if="!form.handle" :sourceId="form.id"></jc-task>
  </div>

</template>
<script>

import { TASK_SOURCES, ALARM_STATUS } from '@/constant/Dictionaries'
import { closeAlarm, updateAlarm } from '@/api/dregsAlarm'


export default {
  name: 'dregsWaringDetail',
  props: {
    info: {
      type: Object,
      default: ()=>{}
    },
    detailShow: {
      type: Boolean
    }
  },
  components: {
    TaskManage: () => import('@/bundles/taskBundle/taskProcess/modules/manage'),
    JcTask: ()=>import('./task.vue')
  },
  data() {
    return {
      loading: false,
      handle: false,
      question: null,
      TaskManageShow: false,
      ALARM_STATUS
    }
  },
  computed: {
    form() {
      // console.log('this.info', this.info)
      return this.info || {}
    }
  },

  methods: {
    async generateTask() {
      //生成任务
      const { id, alarmTypeName } = this.form

      this.question = { // 传递给生成任务组件的数据
        key: id,
        value: id,
        label: alarmTypeName,
        questionTaskSource: TASK_SOURCES.RESIDUEWARING
      }

      this.TaskManageShow = true // 生成任务显示
    },

    async generateTaskSuccess() {
      try {
        //成功生成任务后的回调
        await updateAlarm({ id: this.question.key }) // 更新任务方法
        this.$message.success('操作成功')
        this.$emit('save-success')
        this.$emit('update:detailShow', false)
      } catch (e) {
        console.error(e)
      }
    },

    closeWarning() {
      //关闭告警

      this.$confirm('确认关闭告警', '提示', { type: 'warning' }).then(async () => {
        this.loading = true

        try {
          await closeAlarm({ id: this.info.id })

          this.$message.success('关闭警告成功')
          this.$emit('save-success')
          this.$emit('update:detailShow', false)
          this.loading = false
        } catch (e) {
          console.error(e)
        }
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-detail {
  width: 600px;
  margin: 20px auto 0;
}
.jc-detail-footer {
  text-align: center;
}
@import "@/bundles/taskBundle/css/media.scss";
</style>
