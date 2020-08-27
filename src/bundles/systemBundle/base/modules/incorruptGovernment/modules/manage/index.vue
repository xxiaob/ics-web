<template>
  <el-dialog :title="options ? '编辑语录':'新增语录'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="是否启用" prop="scrollSwitch">
        <el-switch v-model="form.enableRollingMessage" active-color="#409EFF" inactive-color="#cccccc" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="廉政语录" prop="scrollSwitch">
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
import { getStringRule, NOT_NULL, getIntegerRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = {
  rollingMessage: '', enableRollingMessage: 0
}

export default {
  name: 'SystemBaseGovernmentManage',
  mixins: [FormMixins],
  data() {
    return {
      loading: false,
      rules: {
        NOT_NULL,
        Len50: getStringRule(1, 50),
        Int: getIntegerRule()
      }
    }
  },
  components: {
    uploadOneImg: () => import('@/components/JcUpload/uploadOneImg.vue')
  },
  methods: {
    formatFormData() {
      if (this.options) {
        return { ...this.options, recordId: this.options.id }
      } else {
        return { ...defaultForm }
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
          this.loading = false
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
