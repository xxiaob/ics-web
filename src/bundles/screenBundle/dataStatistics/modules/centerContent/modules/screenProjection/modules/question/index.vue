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
        <span>{{formatType(form.problemType)}}</span>
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
import { questionGet, questionTypeList } from '@/api/question'
import JcMedia from '../../components/media'
import { MESSAGE_DATA_TYPES } from '@/constant/Dictionaries'

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
      types: [],
      form: {},
      dialogVideoVisible: false
    }
  },
  watch: {
    options: {
      deep: true,
      handler() {
        if (this.options && this.options.id && this.options.type === MESSAGE_DATA_TYPES.QUESTION) {
          this.getDetail()
        }
      }
    }
  },
  async created() {
    this.types = await questionTypeList() || []
    if (this.options && this.options.id && this.options.type === MESSAGE_DATA_TYPES.QUESTION) {
      this.getDetail()
    }
  },
  methods: {
    formatType(value) {
      const type = this.types.filter(item=>item.id == value)

      return (type[0] && type[0].typeName) || ''
    },
    async getDetail() {
      const res = await questionGet(this.options.id)

      this.form = { ...res }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../css/index.scss";
</style>
