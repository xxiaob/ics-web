<template>
  <el-dialog :title="options ? options.view?'查看问题':'编辑问题' : '问题反馈'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="问题ID" prop="id" v-show="view">
        <el-input v-model="form.id" :disabled="view"></el-input>
      </el-form-item>
      <el-form-item label="上报人" prop="userName" v-show="view">
        <el-input v-model="form.userName" disabled></el-input>
      </el-form-item>
      <el-form-item prop="orgId" label="所属组织" v-show="view">
        <el-cascader :options="orgTree" disabled v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false }" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="问题标题" prop="problemTitle" :rules="rules.Len50">
        <el-input v-model="form.problemTitle" :disabled="view" placeholder="请输入问题标题"></el-input>
      </el-form-item>
      <el-form-item label="问题描述" prop="problemDesc" :rules="rules.NOT_NULL">
        <el-input v-model="form.problemDesc" :disabled="view" placeholder="请输入问题描述" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="问题类型" prop="problemType" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.problemType" filterable remote reserve-keyword placeholder="请输入关键词" :disabled="view" :remote-method="remoteMethod" :loading="loading">
          <el-option v-for="item in questionTypes" :key="item.id" :label="item.typeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附件" prop="uploadFilePaths" :rules="[{required: true, message: '请上传文件'}]">
        <upload v-show="!view" :urls.sync="form.uploadFilePaths" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg,video/*,audio/*"></upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-show="!view">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(true)">反馈</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(false)">暂存</el-button>
    </div>
    <div slot="footer" class="dialog-footer" v-show="handle">
      <el-button @click="toSuperior" :loading="loading" type="primary">反馈至上级</el-button>
      <el-button @click="generateTask" :loading="loading" type="primary">生成任务</el-button>
      <el-button @click="closeQuestion" :loading="loading">关闭问题</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { questionSave, questionReport } from '@/api/question'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import upload from './upload'

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
    upload
  },
  data() {
    return {
      loading: false,
      menus: [],
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      view: false,
      handle: false,
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
        const { view, handle, id, taskId, orgId, userName, problemDesc, problemTitle, problemType, uploadFilePaths } = this.options

        this.view = view || false
        this.handle = handle || false
        return {
          id,
          taskId,
          orgId,
          userName,
          problemDesc,
          problemTitle,
          problemType: problemType.toString(),
          uploadFilePaths: uploadFilePaths || []
        }
      } else {
        this.view = false
        this.handle = false
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
    },
    //反馈至上级
    toSuperior() {
      this.loading = true
      console.log('toSuperior')
      const form = {
        ifUpload: true
      }

      this.questionReport(form)
    },
    //生成任务
    async generateTask() {
      // this.loading = true
      console.log('generateTask')
      // const form = {
      //   ifUpload: false,
      //   ifClose: false
      // }

      // await this.questionReport(form)
      const { id, problemTitle } = this.form

      this.$router.push({ path: 'taskProcess', query: { id, problemTitle } })
    },
    //关闭问题
    closeQuestion() {
      this.loading = true
      console.log('closeQuestion')
      const form = {
        ifUpload: false,
        ifClose: true
      }

      this.questionReport(form)
    },
    async questionReport(form, cb = ()=>{}) {
      const { id: businessKey, taskId } = this.form

      try {
        await questionReport({ businessKey, taskId, ...form })
        this.$message.success('操作成功')
        this.loading = false
        this.dialogVisible = false
        this.dialogVisibleHandle = false
        this.$emit('save-success')
      } catch (error) {
        this.loading = false
        console.error(error)
      }
    }
  }
}
</script>
