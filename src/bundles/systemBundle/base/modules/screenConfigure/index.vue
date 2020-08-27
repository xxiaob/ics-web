<template>
  <div>
    <el-card v-loading="loading">
      <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form">
        <el-form-item label="当前组织">
          <span v-text="user.orgName"></span>
        </el-form-item>
        <el-form-item label="指挥大屏标题">
          <el-input v-model="form.commandScreenLogo" placeholder="请输入指挥大屏标题"></el-input>
        </el-form-item>
        <el-form-item label="数据大屏标题">
          <el-input v-model="form.dataScreenLogo" placeholder="请输入数据大屏标题"></el-input>
        </el-form-item>
      </el-form>
      <div class="jc-footer">
        <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SystemBaseScreenConfigure',
  props: {
    user: {
      type: Object,
      default: ()=>{}
    }
  },
  components: {
    uploadOneImg: () => import('@/components/JcUpload/uploadOneImg.vue')
  },
  data() {
    return {
      form: {
        orgId: '',
        commandScreenLogo: '',
        dataScreenLogo: ''
      },
      loading: false
    }
  },
  created() {
    this.form.orgId = this.user.orgId
  },
  methods: {
    onSubmit() {

    }
  }
}
</script>

<style lang="scss" scoped>
.jc-footer {
  text-align: center;
}
</style>
