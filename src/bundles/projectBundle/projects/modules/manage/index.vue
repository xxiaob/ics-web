<template>
  <el-dialog :title="options ? '编辑项目':'新增项目'" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form">
      <el-form-item label="项目名称" prop="projectName" :rules="rules.Len50">
        <el-input v-model="form.projectName" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目类型">
        <span v-text="projectTypeStr"></span>
      </el-form-item>
      <el-form-item label="项目周期" prop="date" :rules="rules.NOT_NULL">
        <el-date-picker v-model="form.date" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" :default-time="['00:00:00','23:59:59']" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="描述" prop="description" :rules="rules.NOT_NULL">
        <jc-editor v-model="form.description"></jc-editor>
      </el-form-item>
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

let defaultForm = { projectName: '', date: '', description: '' }

export default {
  name: 'ProjectProjectsManage',
  mixins: [FormMixins],
  components: {
    JcEditor: () => import('@/components/JcForm/JcEditor')
  },
  props: ['projectType'],
  data() {
    return {
      loading: false,
      areaType: [],
      rules: {
        Len50: getStringRule(1, 50),
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
