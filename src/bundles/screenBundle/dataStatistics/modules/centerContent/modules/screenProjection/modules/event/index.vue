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
    <jc-media class="media" title="处理前图片" :urls="urls"></jc-media>
    <jc-media class="media jc-right-media" title="处理后前图片" :urls="urls"></jc-media>
    <jc-media class="media" title="视频文件" :urls="urls"></jc-media>
    <jc-media class="media jc-right-media" title="音频文件" :urls="urls"></jc-media>
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
      form: {},
      urls: ['https://192.168.0.180:9000/group1/M00/00/1B/wKgAeF8QV2KAbH_-AAIW1VEkksk412.png', 'https://192.168.0.180:9000/group1/M00/00/1B/wKgAeF8QV2KAbH_-AAIW1VEkksk412.png', 'https://192.168.0.180:9000/group1/M00/00/1C/wKgAeF8Ze-OAXo-OAAhtEcbFSQ0391.zip', 'https://192.168.0.180:9000/group1/M00/00/1B/wKgAeF8Rbv6AOwtpAAAhWWA5JUU347.aac', 'https://192.168.0.180:9000/group1/M00/00/1B/wKgAeF8RbwaAd2HcACWhtioMYrg052.mp4']
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
  width: 48%;
  float: left;
  margin-bottom: $jc-default-dis;
}
.jc-right-media {
  float: right;
}
</style>
