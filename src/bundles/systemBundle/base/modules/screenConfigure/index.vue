<template>
  <div>
    <el-card v-loading="loading">
      <el-form ref="form" label-width="140px" :model="form" class="jc-manage-form">
        <el-form-item label="当前组织">
          <span v-text="user.orgName"></span>
        </el-form-item>
        <el-form-item label="常态指挥大屏标题">
          <el-input v-model="form.commandScreenLogo" placeholder="请输入指挥大屏标题"></el-input>
        </el-form-item>
        <el-form-item label="常态数据大屏标题">
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
import { updateBase } from '@/api/baseConfig'

export default {
  name: 'SystemBaseScreenConfigure',
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
        commandScreenLogo: '',
        dataScreenLogo: ''
      },
      loading: false
    }
  },
  created() {
    this.form.orgId = this.user.orgId
    this.form.commandScreenLogo = this.baseInfo.commandScreenLogo
    this.form.dataScreenLogo = this.baseInfo.dataScreenLogo
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
