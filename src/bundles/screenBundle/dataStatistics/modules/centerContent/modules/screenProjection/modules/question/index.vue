<template>
  <div class="jc-content">
    <el-form label-width="100px" :model="form" size="mini">
      <el-form-item label="问题ID : ">
        <span>{{form.id}}问题ID</span>
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
export default {
  name: 'ScreenDataCenterContentScreenProjectionQuestion',
  components: { JcMedia },
  data() {
    return {
      types: [],
      form: {},
      dialogVideoVisible: false
    }
  },
  async created() {
    this.types = await questionTypeList() || []
    await this.getDetail('73488564293206016')
  },
  methods: {
    formatType(value) {
      const type = this.types.filter(item=>item.id == value)

      return (type[0] && type[0].typeName) || ''
    },
    async getDetail(id) {
      const res = await questionGet(id)

      this.form = { ...res }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../css/index.scss";
</style>
