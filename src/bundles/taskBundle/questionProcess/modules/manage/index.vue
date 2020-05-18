<template>
  <el-dialog :title="options ? '编辑问题' : '新增问题'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="问题标题" prop="problemTitle" :rules="rules.Len50">
        <el-input v-model="form.problemTitle" placeholder="请输入问题标题"></el-input>
      </el-form-item>
      <el-form-item label="问题描述" prop="problemDesc" :rules="rules.NOT_NULL">
        <el-input v-model="form.problemDesc" placeholder="请输入问题描述" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="问题类型" prop="problemType" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.problemType" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
          <el-option v-for="item in questionTypes" :key="item.id" :label="item.typeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附件" prop="uploadFilePaths" :rules="[{required: true, message: '请上传文件'}]">
        <upload :urls.sync="form.uploadFilePaths" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg,video/*,audio/*"></upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(true)">反馈</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(false)">暂存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { questionSave } from '@/api/question'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = {
  problemDesc: '',
  problemTitle: '',
  problemType: '',
  uploadFilePaths: []
}

export default {
  name: 'TaskQuestionProcessManage',
  mixins: [FormMixins],
  props: {
    orgTree: {
      type: Array
    },
    orgId: {
      type: String
    }
  },
  components: {
    upload: () => import('@/components/JcUpload')
  },
  data() {
    return {
      loading: false,
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      questionTypes: [
        { id: 1, typeName: 'typeName' }
      ]
    }
  },
  created() {
    this.remoteMethod('')
  },
  methods: {
    async remoteMethod(query) {
      this.loading = true
      try {
        // this.eventTypes = await eventManageTypeList(query)
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },
    formatFormData() {
      if (this.options) {
        const { id, taskId, orgId, userName, problemDesc, problemTitle, problemType, uploadFilePaths } = this.options

        return {
          id,
          taskId,
          orgId,
          userName,
          problemDesc,
          problemTitle,
          problemType: problemType.toString(),
          uploadFilePaths
        }
      } else {
        return { ...defaultForm, orgId: this.orgId }
      }
    },
    onSubmit(ifReport) {
      this.loading = true
      this.form.ifReport = ifReport // ture 直接反馈   false 暂存
      this.$refs.form.validate(valid => {
        if (valid) {
          questionSave(this.form).then(() => {
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
