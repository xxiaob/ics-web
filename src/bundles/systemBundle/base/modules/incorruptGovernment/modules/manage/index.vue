<template>
  <el-dialog :title="options ? '编辑语录':'新增语录'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="是否启用">
        <el-switch v-model="form.enableRolling" active-color="#409EFF" inactive-color="#cccccc" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="廉政语录" prop="rollingMessage" :rules="rules.NOT_NULL">
        <el-input type="textarea" :rows="3" placeholder="请输入廉政语录" v-model="form.rollingMessage" resize="none">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { rollingMessageSave } from '@/api/baseConfig'
import { NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = {
  rollingMessage: '', enableRolling: 0
}

export default {
  name: 'SystemBaseGovernmentManage',
  mixins: [FormMixins],
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
  props: ['orgId'],
  methods: {
    formatFormData() {
      console.log('options', this.options)
      if (this.options) {
        return {
          enableRolling: this.options.enableRolling,
          rollingMessage: this.options.rollingMessage,
          orgId: this.orgId
        }
      } else {
        return { ...defaultForm, orgId: this.orgId }
      }
    },
    onSubmit() {
      console.log('aa', this.form)
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          rollingMessageSave(this.form).then(() => {
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
