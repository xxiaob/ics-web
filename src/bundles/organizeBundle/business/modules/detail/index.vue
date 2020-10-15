<template>
  <el-dialog title="组织业务详情" :visible.sync="dialogVisible" width="800px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose" top="16vh">
    <div slot="title" class="dialog-title">
      <h3>组织业务详情</h3>
      <div class="title-info">
        <span>{{ form.orgName}}</span> |
        <span>常态项目</span> |
        <span>2020-10-1 ~ 2020-10-30</span>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form" size="mini">
          <el-form-item label="事件上报：">
            <span>{{form.eventReport}}</span>
          </el-form-item>
          <el-form-item label="事件类型占比：">
            <div >市容环境 36.00%</div>
            <div >市容环境 36.00%</div>
            <div >市容环境 36.00%</div>
            <div >市容环境 36.00%</div>
            <div >市容环境 36.00%</div>
            <div >市容环境 36.00%</div>
          </el-form-item>

        </el-form>
      </el-col>
      <el-col :span="8">
        <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form" size="mini">
          <el-form-item label="任务下发：">
            <span>{{form.taskLssus}}</span>
          </el-form-item>
          <el-form-item label="任务来源占比：">
            <div >问题上报 16.00%</div>
            <div >问题上报 36.00%</div>
            <div >问题上报 36.00%</div>
            <div >问题上报 36.00%</div>
            <div >问题上报 36.00%</div>
            <div >问题上报 36.00%</div>
          </el-form-item>
          <el-form-item label="任务接受：">
            <span>{{form.taskAccept}}</span>
          </el-form-item>
          <el-form-item label="任务完成：">
            <span>{{form.taskComplete}}</span>
          </el-form-item>
          <el-form-item label="任务完成率：">
            <span>{{form.taskCompleteRate}}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form" size="mini">
          <el-form-item label="问题上报：">
            <span>{{form.problemReport}}</span>
          </el-form-item>
          <el-form-item label="问题类型占比：">
             <div >问题上报 16.00%</div>
              <div >问题上报 36.00%</div>
              <div >问题上报 36.00%</div>
              <div >问题上报 36.00%</div>
              <div >问题上报 36.00%</div>
              <div >问题上报 36.00%</div>
          </el-form-item>
          <el-form-item label="问题接受：">
            <span>{{form.problemAccept}}</span>
          </el-form-item>
           <el-form-item label="问题处理：">
            <span>{{form.problemHandle}}</span>
          </el-form-item>
          <el-form-item label="问题处理率：">
            <span>{{form.problemHandleRate}}</span>
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
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.dialogVisible = true
      }
    },
    info: {
      // immediate: true,
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
  methods: {
    async getDetail() {
      if (this.info && this.info.id) {
      // const res = await eventManageGet(this.info.id)

        // this.form = { ...this.info, ...res }
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
