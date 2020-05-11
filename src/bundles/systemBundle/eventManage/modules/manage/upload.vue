<template>
  <el-upload :action="uploadUrl" :accept="accept" :headers="uploadHeaders" :before-upload="handleBeforeUpload" :on-success="handleSuccess" :on-remove="handleRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList">
    <el-button size="small" type="primary" :loading="loading">点击上传</el-button>
  </el-upload>
</template>

<script>
import api from '@/api/API'
import { getToken } from '@/libs/storage'

export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadUrl: process.env.API_HOST.base + api.upload,
      uploadHeaders: { token: getToken() },
      loading: false
    }
  },
  computed: {
    fileList() {
      return this.url ? [{ name: this.url, url: this.url }] : []
    }
  },
  methods: {
    handleExceed(files, fileList) {
      if (fileList.length > 0) {
        this.$message.warning('只能上传一个文件')
      }
    },
    handleRemove() {
      this.$emit('update:url', '')
    },
    handleBeforeUpload() {
      this.loading = true
      // this.$emit('update:url', '111')
    },
    handleSuccess(res) {
      if (res.resCode) {
        this.$emit('update:url', res.resData.url)
        this.$message.success('上传成功')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
