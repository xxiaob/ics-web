<template>
  <div class="jc-event">
    <el-form label-width="100px" :model="form" size="mini">
      <el-form-item label="事件ID : ">
        <span>{{form.eventNumber}}事件ID : </span>
      </el-form-item>
      <el-form-item label="上报人 : ">
        <span>{{form.reportUserName}}</span>
      </el-form-item>
      <el-form-item label="所属组织 : ">
        <span>{{form.orgName}}</span>
      </el-form-item>
      <el-form-item label="事件标题 : ">
        <span>{{form.eventTitle}}</span>
      </el-form-item>
      <el-form-item label="上报地点 : ">
        <span>{{form.positionName}}</span>
      </el-form-item>
      <el-form-item label="事件类型 : ">
        <span>{{form.typeName}}</span>
      </el-form-item>
      <el-form-item label="事件描述 : ">
        <div v-html="form.desc"></div>
      </el-form-item>

    </el-form>

    <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="800px" :close-on-click-modal="false" :append-to-body="true">
      <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
    </el-dialog>
  </div>
</template>

<script>
import { eventManageGet } from '@/api/eventManage'
export default {
  name: 'ScreenDataCenterContentScreenProjectionEvent',
  data() {
    return {
      form: {},
      dialogVideoVisible: false
    }
  },
  methods: {
    async getDetail(id) {
      const res = await eventManageGet(id)

      this.form = { ...res }
      // this.audios = this.form.audioAddrs
      // this.audioPlayShows = new Array(this.audios.length).fill(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-event {
  height: 100%;
  overflow-y: auto;
}
.el-form {
  padding: $jc-default-dis;
}
.el-form-item {
  margin-bottom: 10px;

  /deep/ {
    .el-form-item__content,
    .el-form-item__label {
      font-size: 16px;
      color: #8bc1fc;
    }
  }
}
</style>
