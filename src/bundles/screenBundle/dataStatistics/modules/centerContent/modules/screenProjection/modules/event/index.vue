<template>
  <div class="jc-content">
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
    <jc-media class="media" title="处理前图片"></jc-media>
  </div>
</template>

<script>
import { eventManageGet } from '@/api/eventManage'
import JcMedia from '../../components/media'
export default {
  name: 'ScreenDataCenterContentScreenProjectionEvent',
  components: { JcMedia },
  data() {
    return {
      form: {}
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
@import "../../css/index.scss";
.media {
  width: 49%;
  float: left;
}
</style>
