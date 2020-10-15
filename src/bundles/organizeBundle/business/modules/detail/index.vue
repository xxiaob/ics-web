<template>
  <el-dialog title="组织业务详情" :visible.sync="dialogVisible" width="1000px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose" top="16vh">
    <div slot="title" class="dialog-title">
      <h3>组织业务详情</h3>
      <div class="title-info">
        <span>{{ form.orgName}}</span> |
        <span>{{ form.projectName }}</span> |
        <span>{{filter.beginTime | formatDate}} ~ {{filter.endTime | formatDate}}</span>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form" size="mini">
          <el-form-item label="事件上报：">
            <span>{{form.eventCount}}</span>
          </el-form-item>
          <el-form-item label="事件类型占比：">
             <p v-for="(eventItem,index) in form.eventType" :key="index">{{eventItem.typeName}} {{ eventItem.rate | formatPercent}}</p>
          </el-form-item>

        </el-form>
      </el-col>
      <el-col :span="8">
        <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form" size="mini">
          <el-form-item label="任务下发：">
            <span>{{form.taskCount}}</span>
          </el-form-item>
          <el-form-item label="任务来源占比：">
            <p v-for="(taskItem,index) in form.taskSource" :key="index">{{taskItem.typeName}} {{ taskItem.rate | formatPercent}}</p>
          </el-form-item>
          <el-form-item label="任务接受：">
            <span>{{form.taskReceiveCount}}</span>
          </el-form-item>
          <el-form-item label="任务完成：">
            <span>{{form.taskCompletedCount}}</span>
          </el-form-item>
          <el-form-item label="任务完成率：">
            <span>{{form.taskCompletedRate * 100 +'%'}}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form" size="mini">
          <el-form-item label="问题上报：">
            <span>{{form.problemReportCount}}</span>
          </el-form-item>
          <el-form-item label="问题类型占比：">
             <p v-for="(problemItem,index) in form.problemType" :key="index">{{problemItem.typeName}} {{ problemItem.rate | formatPercent}}</p>
          </el-form-item>
          <el-form-item label="问题接受：">
            <span>{{form.problemReceiveCount}}</span>
          </el-form-item>
           <el-form-item label="问题处理：">
            <span>{{form.problemhandlingCount}}</span>
          </el-form-item>
          <el-form-item label="问题处理率：">
            <span>{{form.problemhandlingRate*100 + '%'}}</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="downloadDetail">导出</el-button>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { amountFormatter } from '@/libs/dataFormatter'
export default {
  name: 'OrganizeBusinessDetail',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: ()=>{}
    },
    filter: {
      type: Object,
      default: ()=>{}
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.dialogVisible = true
      }
    },
    info: {
      deep: true,
      handler() {
        this.getDetail()
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {}
    }
  },
  filters: {
    formatDate(date) {
      return date && date.toLocaleDateString()
    },
    formatPercent(val) {
      return amountFormatter(val * 100, 2) + '%'
    }
  },
  methods: {
    async getDetail() {
      if (this.info) {
        this.form = { ...this.info }
      }
    },
    dialogClose() {
      this.$emit('update:visible', false)
    },
    downloadDetail() {
      console.log('downloadDetail')
      // exportDetail(this.info.id)
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}

.dialog-title{
  display:flex;
  line-height: 30px;

  .title-info{
    margin-left:30px;
    color:#c0c0c0;

    span{
      margin:0 10px;
    }
  }
}

.el-row {
  .el-form-item{
    margin-bottom:6px;
  }
}
</style>
