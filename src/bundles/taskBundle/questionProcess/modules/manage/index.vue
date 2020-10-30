<template>
  <el-dialog :title="options ? '编辑问题' : '新增问题'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose" top="5vh">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="问题标题" prop="problemTitle" :rules="rules.Len50">
        <el-input v-model="form.problemTitle" placeholder="请输入问题标题"></el-input>
      </el-form-item>
      <el-form-item label="问题类型" prop="problemType" :rules="rules.SELECT_NOT_NULL">
        <el-cascader :options="types" v-model="form.problemType" :props="{expandTrigger: 'hover', emitPath: false }" clearable></el-cascader>
      </el-form-item>
      <el-form-item prop="problemSource" label="问题来源" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.problemSource" placeholder="选择问题来源">
          <el-option v-for="item in QUESTION_SOURCES.VALUES" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题位置" prop="position" :rules="rules.NOT_NULL">
        <el-input v-model="form.position" style="display:none"></el-input>
        <span>{{form.positionName}}</span>
      </el-form-item>
      <el-form-item>
        <div class="jc-map-tip">右键点击地图选中位置</div>
        <div class="jc-map">
          <map-user-marker v-model="position" :isGetUser="false"></map-user-marker>
        </div>
      </el-form-item>
      <el-form-item label="问题描述" prop="problemDesc" :rules="rules.NOT_NULL">
        <jc-editor v-model="form.problemDesc"></jc-editor>
      </el-form-item>
      <el-form-item label="附件" prop="uploadFilePaths">
        <upload :show="dialogVisible" :urls.sync="form.uploadFilePaths"></upload>
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
import { QUESTION_SOURCES } from '@/constant/Dictionaries'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = {
  problemDesc: '',
  problemTitle: '',
  problemType: '',
  uploadFilePaths: [],
  position: '',
  positionName: '',
  problemSource: ''
}

export default {
  name: 'QuestionProcessManage',
  mixins: [FormMixins],
  props: {
    types: {
      type: Array
    },
    orgId: {
      type: String
    }
  },
  components: {
    upload: () => import('@/components/JcUpload'),
    JcEditor: () => import('@/components/JcForm/JcEditor'),
    MapUserMarker: () => import('@/components/JcMap/MapUserMarker')
  },
  data() {
    return {
      QUESTION_SOURCES,
      position: {},
      loading: false,
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL,
        NOT_NULL
      }
    }
  },
  watch: {
    position: {
      handler(val) {
        this.form.position = val.position
        this.form.positionName = val.name
      },
      deep: true
    }
  },
  methods: {
    formatFormData() {
      if (this.options) {
        const { id, taskId, orgId, userName, problemDesc, problemTitle, problemType, uploadFilePaths, position, positionName, problemSource } = this.options

        this.position = { position: position, name: positionName }
        return {
          id,
          taskId,
          orgId,
          userName,
          problemDesc,
          problemTitle,
          positionName,
          position,
          problemType: problemType.toString(),
          problemSource: problemSource && (problemSource + ''),
          uploadFilePaths
        }
      } else {
        this.position = {}
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
<style lang="scss" scoped>
.jc-myeditor {
  height: 200px;
  /deep/ .w-e-text-container {
    height: 160px !important;
  }
}
.jc-map {
  height: 250px;
  line-height: normal;
  position: relative;

  // /deep/ {
  //   .el-radio-group,
  //   .jc-select-warp {
  //     display: none;
  //   }
  // }
}
.jc-map-tip {
  color: red;
  font-size: 12px;
  line-height: normal;
  // position: absolute;
  // top: 5px;
  // left: 5px;
  // z-index: 100;
}
</style>
