<template>
  <div>
    <div class="img" v-show="url">
      <img :src="url" alt="" width="100%">
      <img class="jc-close" src="@/bundles/taskBundle/assets/close.png" alt="" title="删除" @click.stop="handleRemove">
    </div>
    <el-upload v-show="!url" :action="uploadUrl" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" :headers="uploadHeaders" :before-upload="handleBeforeUpload" :on-success="handleSuccess" :show-file-list="false">
      <el-button size="small" type="primary" :loading="loading">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import api from '@/api/API'
import { getToken } from '@/libs/storage'

export default {
  name: 'UploadOneImg',
  props: {
    url: ''
  },
  data() {
    return {
      loading: false,
      uploadUrl: process.env.API_HOST.base + api.upload,
      uploadHeaders: { token: getToken() }
    }
  },
  methods: {
    handleRemove() {
      this.$emit('update:url', '')
    },
    handleBeforeUpload() {
      this.loading = true
    },
    handleSuccess(res) {
      if (res.resCode) {
        this.$emit('update:url', res.resData.url)
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.resMsg.msgText)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.img {
  position: relative;
  .jc-close {
    position: absolute;
    top: 2px;
    right: 2px;
    cursor: pointer;
  }
}
</style>
