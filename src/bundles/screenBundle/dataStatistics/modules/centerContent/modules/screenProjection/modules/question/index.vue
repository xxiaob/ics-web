<template>
  <div class="jc-content data-statistics-scrollbar">
    <el-form label-width="100px" :model="form" size="mini">
      <el-form-item label="问题ID : ">
        <span>{{form.id}}</span>
      </el-form-item>
      <el-form-item label="上报人 : ">
        <span>{{form.userName}}</span>
      </el-form-item>
      <el-form-item label="所属组织 : ">
        <span>{{form.orgName}}</span>
      </el-form-item>
      <el-form-item label="问题标题 : ">
        <span>{{form.problemTitle}}</span>
      </el-form-item>
      <el-form-item label="问题类型 : ">
        <span>{{form.problemTypeName}}</span>
      </el-form-item>
      <el-form-item label="问题来源 : ">
        <span>{{formatSource(form.problemSource)}}</span>
      </el-form-item>
      <el-form-item label="问题位置 : ">
        <span>{{form.positionName}}</span>
      </el-form-item>
      <el-form-item label="问题描述 : ">
        <div v-html="form.problemDesc"></div>
      </el-form-item>
    </el-form>
    <jc-media class="media" title="附件" :urls="form.uploadFilePaths"></jc-media>
  </div>
</template>

<script>
import { questionGet } from '@/api/question'
import JcMedia from '../../components/media'
import { MESSAGE_DATA_TYPES, SYSTEM_MESSAGE_TYPE, QUESTION_SOURCES } from '@/constant/Dictionaries'

export default {
  name: 'ScreenDataCenterContentScreenProjectionQuestion',
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
    formatSource(value) {
      return QUESTION_SOURCES.toString(value + '')
    },
    async getDetail() {
      if (this.options && this.options.id && this.options.type === MESSAGE_DATA_TYPES.QUESTION && this.options.systemSourceType == SYSTEM_MESSAGE_TYPE.SELF) {
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
