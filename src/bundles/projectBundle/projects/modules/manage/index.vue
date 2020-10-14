<template>
<!-- width="1000px" -->
  <el-dialog :title="options ? '编辑项目':'新增项目'" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose" top="10vh">
    <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form jc-clearboth">
      <!-- class="jc-left-width60" -->
      <div >
        <el-form-item label="项目名称" prop="projectName" :rules="rules.Len50">
          <el-input v-model="form.projectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目类型">
          <span v-text="projectTypeStr"></span>
        </el-form-item>
        <el-form-item label="项目周期" prop="date" :rules="rules.NOT_NULL">
          <el-date-picker v-model="form.date" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" :default-time="['00:00:00','23:59:59']" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <!-- :label="projectType==PROJECT_TYPES.EmergencySupport?'电子预案':'描述'" -->
        <el-form-item label="描述" prop="description" :rules="rules.NOT_NULL">
          <jc-editor v-model="form.description"></jc-editor>
        </el-form-item>
        <!-- <el-form-item label="预案附件" v-if="projectType==PROJECT_TYPES.EmergencySupport">
          <upload :show="dialogVisible" :urls.sync="form.uploadFilePaths" accept="*"></upload>
        </el-form-item> -->
      </div>
      <!-- <div class="jc-left-width40">
        <div class="jc-divider">复制现有的项目配置</div>
        <el-form-item label="网格配置">
          <el-select v-model="form.grid" clearable placeholder="请选择项目">
            <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName" :value="item.projectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员配置">
          <el-select v-model="form.user" clearable placeholder="请选择项目">
            <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName" :value="item.projectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备配置">
          <el-select v-model="form.device" clearable placeholder="请选择项目">
            <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName" :value="item.projectId">
            </el-option>
          </el-select>
        </el-form-item>
      </div> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { PROJECT_TYPES } from '@/constant/Dictionaries'
import { projectsSave } from '@/api/projects'
import { getStringRule, NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { projectName: '', date: '', description: '', uploadFilePaths: [], grid: '', user: '', device: '' }

export default {
  name: 'ProjectProjectsManage',
  mixins: [FormMixins],
  components: {
    upload: () => import('@/components/JcUpload'),
    JcEditor: () => import('@/components/JcForm/JcEditor')
  },
  props: ['projectType', 'projectList'],
  data() {
    return {
      PROJECT_TYPES,
      loading: false,
      areaType: [],
      rules: {
        Len50: getStringRule(1, 50),
        Len1000: getStringRule(1, 1000),
        NOT_NULL
      }
    }
  },
  computed: {
    projectTypeStr() {
      return PROJECT_TYPES.toString(this.projectType)
    }
  },
  methods: {
    formatFormData() {
      if (this.options) {
        return {
          projectId: this.options.projectId,
          projectName: this.options.projectName,
          date: [this.options.beginTime, this.options.endTime],
          description: this.options.description
        }
      } else {
        return { ...defaultForm }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          projectsSave({ ...this.form, projectType: this.projectType, beginTime: this.form.date[0], endTime: this.form.date[1] }).then(() => {
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
  height: 240px;
  /deep/ .w-e-text-container {
    height: 200px !important;
  }
}
.jc-divider{
  line-height: 32px;
  text-align: center;
}
.jc-clearboth::before,
.jc-clearboth::after {
  display: table;
  content: "";
  clear: both;
}
.jc-left-width60 {
  width: 60%;
  float: left;
  box-sizing: border-box;
}
.jc-left-width40 {
  width: 40%;
  float: left;
  box-sizing: border-box;
}
.jc-icon-img {
  width: 50px;
  height: 40px;
  cursor: pointer;
  background-position: center;
  background-repeat: no-repeat;
  background-size: auto 40px;
}
.jc-icon-space {
  position: relative;
  width: 100%;
  border-top: solid 1px $jc-color-line-primary;
  max-height: 200px;
  margin-top: 10px;
  padding-top: 10px;
  overflow: auto;
  .jc-icon-item {
    display: block;
    float: left;
    width: 50px;
    height: 50px;
    cursor: pointer;
    background-position: center;
    background-repeat: no-repeat;
    background-size: auto 40px;
    opacity: 0.9;
    &:hover {
      opacity: 1;
      background-color: $jc-bg-color;
    }
  }
}
</style>
