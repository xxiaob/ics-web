<template>
  <el-dialog :title="options ? '编辑职位':'新增职位'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="职位名称" prop="positionName" :rules="rules.Len50">
        <el-input v-model="form.positionName" placeholder="请输入职位名称"></el-input>
      </el-form-item>
      <el-form-item label="职位优先级" prop="index" :rules="rules.Int">
        <el-input v-model.number="form.index" placeholder="请输入职位优先级"></el-input>
      </el-form-item>
      <el-form-item label="默认头像" prop="photo">
        <div class="jc-icon-img" :style="getIconStyle(form.photo)"></div>
        <div class="jc-icon-space">
          <div class="jc-icon-item" v-for="(item,key) in icons" @click="iconsClick(key)" :key="key" :title="item.name" :style="{'background-image':` url(${item.icon})`}"></div>
        </div>
      </el-form-item>
      <el-form-item label="允许登录终端" prop="type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox v-for="item in types" :label="item.value" :key="item.value" name="type">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="APP音视频" prop="media" v-if="opera">
        <el-checkbox-group v-model="form.media">
          <el-checkbox label="1" name="media">视频通话</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { positionSave } from '@/api/position'
import { getStringRule, getIntegerRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { LOGIN_DEVICE_TYPES } from '@/constant/Dictionaries'
import { JcUserIcons } from '@/config/JcIconConfig'

let defaultForm = { positionName: '', photo: '', index: 0 }

export default {
  name: 'SystemPositionManage',
  mixins: [FormMixins],
  data() {
    return {
      loading: false,
      types: LOGIN_DEVICE_TYPES.VALUES,
      icons: JcUserIcons.icons,
      rules: {
        Len50: getStringRule(1, 50),
        Int: getIntegerRule()
      }
    }
  },
  props: { opera: false },
  methods: {
    iconsClick(photo) {
      this.form.photo = photo
    },
    formatFormData() {
      if (this.options) {
        return {
          positionId: this.options.positionId,
          positionName: this.options.positionName,
          photo: this.options.photo,
          index: this.options.index,
          type: this.options.type || [],
          media: this.options.media || []
        }
      } else {
        return { ...defaultForm, type: [], media: [] }
      }
    },
    getIconStyle(photo) {
      let icon = photo && JcUserIcons.icons[photo] ? JcUserIcons.icons[photo].icon : JcUserIcons.online

      return `background-image: url(${icon});`
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.loginType = this.form.type.join(',')
          this.form.mobileFunction = this.form.media.join(',')
          positionSave(this.form).then(() => {
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
