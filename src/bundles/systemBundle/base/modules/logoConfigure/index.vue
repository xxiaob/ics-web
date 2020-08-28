<template>
  <div>
    <el-card v-loading="loading">
      <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
        <el-form-item label="当前组织">
          <span v-text="user.orgName"></span>
        </el-form-item>
        <el-form-item label="首页logo">
          <upload-one-img :url.sync="form.welcomeLogo"></upload-one-img>
        </el-form-item>
        <el-form-item label="系统logo">
          <upload-one-img :url.sync="form.homePageLogo"></upload-one-img>
        </el-form-item>
      </el-form>
      <div class="jc-footer">
        <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { updateBase } from '@/api/baseConfig'

export default {
  name: 'SystemBaseLogoConfigure',
  props: {
    user: {
      type: Object,
      default: ()=>{}
    },
    baseInfo: {
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
        welcomeLogo: '',
        homePageLogo: ''
      },
      loading: false
    }
  },
  created() {
    this.form.orgId = this.user.orgId
    this.form.welcomeLogo = this.baseInfo.welcomeLogo
    this.form.homePageLogo = this.baseInfo.homePageLogo
  },
  methods: {
    async onSubmit() {
      this.loading = true
      try {
        await updateBase(this.form)
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-footer {
  text-align: center;
}
</style>
