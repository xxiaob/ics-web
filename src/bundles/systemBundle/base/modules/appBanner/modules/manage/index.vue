<template>
  <el-dialog :title="options ? '编辑banner':'新增banner'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="banner图片" prop="banner" :rules="rules.NOT_NULL">
        <upload-one-img :url.sync="form.banner"></upload-one-img>
      </el-form-item>
      <el-form-item label="启用" prop="enable" :rules="rules.NOT_NULL">
        <el-switch v-model="form.enable" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addAppBanner } from '@/api/baseConfig'
import { NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = {
  enable: 1,
  banner: ''
}

export default {
  name: 'SystemBaseAppBannerManage',
  mixins: [FormMixins],
  props: {
    user: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      loading: false,
      rules: {
        NOT_NULL
      }
    }
  },
  components: {
    uploadOneImg: () => import('@/components/JcUpload/uploadOneImg.vue')
  },
  methods: {
    formatFormData() {
      if (this.options) {
        return { ...this.options }
      } else {
        return { ...defaultForm }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          addAppBanner({ ...this.form, orgId: this.user.orgId }).then(() => {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.$emit('save-success')
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
