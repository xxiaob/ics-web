<template>
  <div class="jc-content data-statistics-scrollbar">
    <el-form label-width="100px" :model="form" size="mini">
      <el-form-item label="事件ID : ">
        <span>{{form.eventNumber}}</span>
      </el-form-item>
      <el-form-item :label="SYSTEM_MESSAGE_TYPE.DREGS==options.systemSourceType?'处置人 : ':'上报人 : '">
        <span>{{form.reportUserName}}</span>
      </el-form-item>
      <el-form-item label="所属组织 : ">
        <span>{{form.orgName}}</span>
      </el-form-item>
      <el-form-item label="事件标题 : ">
        <span>{{form.eventTitle}}</span>
      </el-form-item>
      <div v-if="SYSTEM_MESSAGE_TYPE.DREGS==options.systemSourceType">
        <el-form-item label="车牌号 : ">
          <span>{{form.carNumber}}</span>
        </el-form-item>
        <el-form-item label="处置时间 : ">
          <span>{{form.handleDate}}</span>
        </el-form-item>
        <el-form-item label="处置意见 : ">
          <span>{{form.opinion}}</span>
        </el-form-item>
      </div>

      <el-form-item label="事件类型 : " v-else>
        <span>{{form.typeName}}</span>
      </el-form-item>
      <el-form-item :label="SYSTEM_MESSAGE_TYPE.DREGS==options.systemSourceType?'处置地点 : ':'上报地点 : '">
        <span>{{form.positionName}}</span>
      </el-form-item>
      <el-form-item label="事件描述 : ">
        <div v-html="form.desc"></div>
      </el-form-item>
    </el-form>
    <jc-media class="media" title="处理前图片" :urls="form.beforePhotos"></jc-media>
    <jc-media class="media jc-right-media" title="处理后前图片" :urls="form.afterPhotos"></jc-media>
    <jc-media class="media" title="视频文件" :urls="form.videoAddrs"></jc-media>
    <jc-media class="media jc-right-media" title="音频文件" :urls="form.audioAddrs"></jc-media>
  </div>
</template>

<script>
import { eventManageGet } from '@/api/eventManage'
import JcMedia from '../../components/media'
import { MESSAGE_DATA_TYPES, SYSTEM_MESSAGE_TYPE } from '@/constant/Dictionaries'

export default {
  name: 'ScreenDataCenterContentScreenProjectionEvent',
  components: { JcMedia },
  props: {
    options: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      SYSTEM_MESSAGE_TYPE,
      form: {}
    }
  },
  watch: {
    options: {
      deep: true,
      handler() {
        if (this.options && this.options.id && this.options.type === MESSAGE_DATA_TYPES.EVENT) {
          this.getDetail()
        }
      }
    }
  },
  created() {
    if (this.options && this.options.id && this.options.type === MESSAGE_DATA_TYPES.EVENT) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      const res = await eventManageGet(this.options.id)

      this.form = { ...res }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../css/index.scss";
</style>
