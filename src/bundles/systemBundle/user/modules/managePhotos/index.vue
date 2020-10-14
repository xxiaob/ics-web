<template>
  <el-dialog title="批量照片导入" :visible.sync="dialogVisible" width="400px" :append-to-body="true" :close-on-click-modal="false" top="30vh" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="照片压缩包">
        <el-upload :action="uploadUrl" accept=".zip,.rar" :headers="uploadHeaders" name="multipartFile" :before-upload="handleBeforeUpload" :on-success="handleSuccess" :show-file-list="false">
          <el-button size="mini" type="primary" :loading="loading" icon="el-icon-upload2">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import api from '@/api/API'
import { getToken } from '@/libs/storage'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'SystemUserManagePhotos',
  mixins: [FormMixins],
  data() {
    return {
      uploadUrl: process.env.apiHostConfig.base + api.user.updPhotos,
      uploadHeaders: { token: getToken() },
      loading: false
    }
  },
  methods: {
    formatFormData() {
      return {}
    },
    handleBeforeUpload() {
      this.loading = true
    },
    handleSuccess(res) {
      if (res.resCode) {
        let str = ''

        Object.entries(res.resData).forEach(item=>{
          const resItem = `<div style="line-height:22px">${item[0]}:${item[1]} <br></div>`

          str += resItem
        })

        this.$message({
          dangerouslyUseHTMLString: true,
          message: str
        })
        this.dialogVisible = false
      } else {
        this.$message.error(res.resMsg.msgText)
      }
      this.loading = false
    }
  }
}
</script>
