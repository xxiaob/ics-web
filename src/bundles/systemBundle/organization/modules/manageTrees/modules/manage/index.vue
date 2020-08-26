<template>
  <el-dialog :title="options ? '编辑组织':'新增组织'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose">
    <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form">
      <el-form-item label="上级组织">
        <span v-text="pNode.name"></span>
      </el-form-item>
      <el-form-item label="组织名称" prop="orgName" :rules="rules.Len50">
        <el-input v-model="form.orgName" placeholder="请输入组织名称"></el-input>
      </el-form-item>
      <el-form-item label="组织编码" prop="orgCode">
        <el-input v-model="form.orgCode" placeholder="请输入组织编码"></el-input>
      </el-form-item>
      <el-form-item label="是否同级查看" prop="sameLevelAuth">
        <el-switch v-model="form.sameLevelAuth" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="指挥大屏标题">
        <el-input v-model="form.commandScreenLogo" placeholder="请输入指挥大屏标题"></el-input>
      </el-form-item>
      <el-form-item label="数据大屏标题">
        <el-input v-model="form.dataScreenLogo" placeholder="请输入数据大屏标题"></el-input>
      </el-form-item>
      <!-- <el-form-item label="首页logo">
        <upload-one-img :url.sync="form.welcomeLogo"></upload-one-img>
      </el-form-item>
      <el-form-item label="系统logo">
        <upload-one-img :url.sync="form.homePageLogo"></upload-one-img>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { organizationSave } from '@/api/organization'
import { getStringRule, NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { orgName: '', sameLevelAuth: '0', orgCode: '', commandScreenLogo: '', dataScreenLogo: '', welcomeLogo: '', homePageLogo: '' }

export default {
  name: 'SystemOrganizationManage',
  mixins: [FormMixins],
  props: ['pNode'],
  data() {
    return {
      loading: false,
      rules: {
        NOT_NULL,
        Len50: getStringRule(1, 50)
      }
    }
  },
  // components: {
  //   uploadOneImg: () => import('@/components/JcUpload/uploadOneImg.vue')
  // },
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
          organizationSave({ ...this.form, pid: this.pNode.pid }).then((res) => {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.$emit('save-success', res.orgId)
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
