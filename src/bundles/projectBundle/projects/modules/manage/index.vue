<template>
  <el-dialog :title="options ? '编辑区域类型':'新增区域类型'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form">
      <el-form-item label="区域类型名称" prop="projectName" :rules="rules.Len50">
        <el-input v-model="form.areaTypeName" placeholder="请输入项目名称"></el-input>
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
import { getStringRule, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { projectName: '', projectType: '' }

export default {
  name: 'ProjectProjectsManage',
  mixins: [FormMixins],
  data() {
    return {
      loading: false,
      areaType: [],
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL
      }
    }
  },
  methods: {
    iconsClick(icon) {
      this.form.icon = icon
      this.showIcons = false
    },
    getIconStyle(icon) {
      let useIcon = JcIcons[icon] || {}

      return `background-image: url(${useIcon.icon || ''});`
    },
    formatFormData() {
      if (this.options) {
        return {
          areaTypeId: this.options.areaTypeId,
          areaTypeName: this.options.areaTypeName,
          icon: this.options.icon
        }
      } else {
        return { ...defaultForm }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          projectsSave(this.form).then(() => {
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
