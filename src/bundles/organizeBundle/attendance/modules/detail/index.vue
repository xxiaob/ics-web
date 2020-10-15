<template>
  <el-dialog title="组织业务详情" :visible.sync="dialogVisible" width="800px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose" top="16vh">
    <div slot="title" class="dialog-title">
      <h3>组织业务详情</h3>
      <div class="title-info">
        <span>{{ form.orgName}}</span> |
        <span>{{ form.projectName }}</span> |
        <span>{{filter.startTime | formatDate}} ~ {{filter.endTime | formatDate}}</span>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form" size="mini">
          <el-form-item label="巡逻里程(km):">
            <span>{{form.inCircleJourney}}</span>
          </el-form-item>
          <el-form-item label="巡逻时长(h)：">
             <span>{{form.inCircleDuration}}</span>
          </el-form-item>

        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form" size="mini">
          <el-form-item label="出圈里程(km)：">
            <span>{{form.outCircleJourney}}</span>
          </el-form-item>
          <el-form-item label="出圈时长(h)：">
           <span>{{form.outCircleDuration}}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form" size="mini">
          <el-form-item label="在岗里程(km)：">
            <span>{{form.journey}}</span>
          </el-form-item>
          <el-form-item label="在岗时长(h)：">
           <span>{{form.onguardDuration}}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form" size="mini">
          <el-form-item label="岗点触碰：">
            <span>{{form.inoutCount}}</span>
          </el-form-item>
          <el-form-item label="岗点日常任务：">
             <span>{{form.postTaskCount}}</span>
          </el-form-item>
          <el-form-item label="岗点达标任务：">
            <span>{{form.postReachTaskCount}}</span>
          </el-form-item>
           <el-form-item label="岗点任务达标率:">
            <span>{{form.postReachRate}}</span>
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
import { exportAttendanceDetail } from '@/api/organizeInfo'
export default {
  name: 'OrganizeAttendanceDetail',
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
    }
  },
  created() {
    if (this.info) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      this.form = { ...this.info }
    },
    dialogClose() {
      this.$emit('update:visible', false)
    },
    downloadDetail() {
      exportAttendanceDetail({ ...this.filter, orgId: this.form.orgId })
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
