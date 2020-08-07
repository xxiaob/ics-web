<template>
  <div>
    <el-upload drag :action="uploadUrl" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" :headers="uploadHeaders" :before-upload="handleBeforeUpload" :on-success="handleSuccess" :show-file-list="false">
      <i v-show="!url" class="el-icon-upload"></i>
      <div v-show="!url" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="advice" v-if="isShowAdvice">建议上传图片规格：60px png 透明</div>
      <img class="myImg" v-show="url" :src="url" alt="">
    </el-upload>
  </div>
</template>

<script>
import api from '@/api/API'
import { getToken } from '@/libs/storage'

export default {
  name: 'UploadOneImg',
  props: {
    url: '',
    isShowAdvice: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      uploadUrl: process.env.apiHostConfig.base + api.upload,
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
/deep/ .el-upload-dragger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .el-icon-upload{
    margin-top:16px;
  }
  .myImg {
    max-width: 100%;
    max-height: 180px;
    object-fit: contain;
  }
  .advice{
    color:#ccc;
  }
}
</style>
