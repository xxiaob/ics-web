<template>
  <div class="jc-content data-statistics-scrollbar">
    <el-form label-width="100px" :model="form" size="mini">
      <el-form-item label="问题标题 : ">
        <span>{{form.problemTitle}}</span>
      </el-form-item>
      <el-form-item label="问题ID : ">
        <span>{{form.id}}</span>
      </el-form-item>
      <el-form-item label="上报人 : ">
        <span>{{form.userName}}</span>
      </el-form-item>
      <el-form-item label="所属组织 : ">
        <span>{{form.orgName}}</span>
      </el-form-item>
      <el-form-item label="车牌号 : ">
        <span>{{form.carNumber}}</span>
      </el-form-item>
      <el-form-item label="运输公司 : ">
        <span>{{form.transportCompany}}</span>
      </el-form-item>
      <el-form-item label="查处地址 : ">
        <span>{{form.positionName}}</span>
      </el-form-item>
      <el-form-item label="问题描述 : ">
        <div v-html="form.problemDesc"></div>
      </el-form-item>
    </el-form>
    <jc-media class="media" title="现场照片" :urls="form.filePO&&form.filePO.photos"></jc-media>
    <jc-media class="media jc-right-media" title="视频" :urls="form.filePO&&form.filePO.videoAddrs"></jc-media>
    <jc-media class="media" title="音频" :urls="form.filePO&&form.filePO.audioAddrs"></jc-media>
  </div>
</template>

<script>
import { questionGet } from '@/api/question'
import JcMedia from '../../components/media'
import { MESSAGE_DATA_TYPES, SYSTEM_MESSAGE_TYPE } from '@/constant/Dictionaries'

export default {
  name: 'ScreenDataCenterContentScreenProjectionDregsQuestion',
  components: { JcMedia },
  props: {
    options: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      form: {}
    }
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.getDetail()
      }
    }
  },
  async created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      if (this.options && this.options.id && this.options.type === MESSAGE_DATA_TYPES.QUESTION && this.options.systemSourceType == SYSTEM_MESSAGE_TYPE.DREGS) {
        try {
          const res = await questionGet(this.options.id)

          this.form = { ...res }
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../css/index.scss";
</style>
