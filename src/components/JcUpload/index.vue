<template>
  <el-upload :action="uploadUrl" :accept="accept" :headers="uploadHeaders" :before-upload="handleBeforeUpload" :on-success="handleSuccess" :show-file-list="false">
    <el-button size="small" type="primary" :loading="loading">点击上传</el-button>
  </el-upload>
</template>

<script>
import api from '@/api/API'
import { getToken } from '@/libs/storage'

export default {
  props: {
    urls: {
      type: Array,
      default: ()=>[]
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
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
      let urls = []

      if (fileList && fileList.length) {
        urls = this.formatUrls(fileList)
      }
      this.$emit('update:urls', urls)
    },
    formatUrls(fileList) {
      return fileList.map(item=>{
        if (item.url) {
          return item.url
        } else if (item.response) {
          return item.response.resData.url
        }
      })
    },
    handleBeforeUpload() {
      this.loading = true
    },
    handleSuccess(res, file, fileList) {
      // console.log(file, fileList)
      if (res.resCode) {
        const urls = this.formatUrls(fileList)

        this.$emit('update:urls', urls)
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.resMsg.msgText)
      }
      this.loading = false
    }
  }
}
</script>
