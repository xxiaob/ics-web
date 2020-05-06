<template>
  <el-dialog :title="options ? '编辑版本':'新增版本'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="设备类型" prop="deviceType" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.deviceType" placeholder="选择设备类型">
          <el-option v-for="(value,key) in deviceTypes" :key="key" :label="value" :value="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称" prop="pkgName" :rules="rules.Len20">
        <el-input v-model="form.pkgName" placeholder="请输入应用名称"></el-input>
      </el-form-item>
      <el-form-item label="应用信息" prop="updateInfo" :rules="rules.NOT_NULL">
        <el-input v-model="form.updateInfo" placeholder="请输入应用信息" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="版本号" prop="version" :rules="rules.NOT_NULL">
        <el-input v-model="form.version" placeholder="请输入版本号"></el-input>
      </el-form-item>
      <el-form-item label="应用文件" prop="url" :rules="[{ required: true, message: '请上传文件' }]">
        <el-upload class="upload-demo" :action="uploadUrl" :headers="uploadHeaders" :on-success="handleSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { deviceUpdateSave } from '@/api/deviceUpdate'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import { deviceTypes } from '../../const'
import FormMixins from '@/mixins/FormMixins'
import api from '@/api/API'
import { getToken } from '@/libs/storage'


let defaultForm = { deviceType: '0', pkgName: '', updateInfo: '', url: '', version: '' }

export default {
  name: 'SystemDeviceUpdateManage',
  mixins: [FormMixins],
  data() {
    return {
      uploadUrl: process.env.API_HOST.base + api.upload,
      uploadHeaders: { token: getToken() },
      deviceTypes,
      loading: false,
      menus: [],
      rules: {
        Len20: getStringRule(1, 20),
        SELECT_NOT_NULL,
        NOT_NULL
      }
    }
  },
  methods: {
    handleSuccess(res, file) {
      console.log(res)
    },
    formatFormData() {
      if (this.options) {
        return {
          id: this.options.id,
          deviceType: this.options.deviceType.toString(),
          pkgName: this.options.pkgName,
          updateInfo: this.options.updateInfo,
          url: this.options.url,
          version: this.options.version
        }
      } else {
        return { ...defaultForm }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          deviceUpdateSave(this.form).then(() => {
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
