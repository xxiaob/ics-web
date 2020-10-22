<template>
  <el-dialog :title="options ? '编辑区域类型':'新增区域类型'" :visible.sync="dialogVisible" :close-on-click-modal="false" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form">
      <el-form-item label="区域类型名称" prop="areaTypeName" :rules="rules.Len50">
        <el-input v-model="form.areaTypeName" placeholder="请输入区域类型名称"></el-input>
      </el-form-item>
      <el-form-item label="区域类型图标" prop="icon" :rules="rules.SELECT_NOT_NULL">
        <div class="jc-icon-img" :style="getIconStyle(form.icon)"></div>
        <div class="jc-icon-space">
          <div class="jc-icon-item" v-for="(item,key) in JcIcons" @click="iconsClick(key)" :key="key" :title="item.name" :style="{'background-image':` url(${item.icon})`}"></div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { areaTypeSave } from '@/api/areaType'
import { getStringRule, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { JcIcons } from '@/config/JcIconConfig'

let defaultForm = { areaTypeName: '', icon: '' }

export default {
  name: 'SystemAreaTypeManage',
  mixins: [FormMixins],
  data() {
    return {
      loading: false,
      areaType: [],
      JcIcons: JcIcons,
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL
      }
    }
  },
  methods: {
    iconsClick(icon) {
      this.form.icon = icon
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
          areaTypeSave(this.form).then(() => {
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
