<template>
  <el-dialog :title="options ? '编辑菜单':'新增菜单'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="菜单名称" prop="resName" :rules="rules.Len50">
        <el-input v-model="form.resName" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="pid">
        <el-select v-model="form.pid" placeholder="请选择">
          <el-option v-for="item in menus" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input v-model="form.icon" placeholder="请输入菜单图标"></el-input>
      </el-form-item>
      <el-form-item label="菜单地址" prop="url" :rules="rules.Len50">
        <el-input v-model="form.url" placeholder="请输入菜单地址"></el-input>
      </el-form-item>
      <el-form-item label="序号" prop="sort" :rules="rules.Int">
        <el-input v-model="form.sort" placeholder="请输入序号"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { menusList, menusSave } from '@/api/menus'
import { getStringRule, getIntegerRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { resName: '', sort: 0, pid: '', url: '', icon: '' }

export default {
  name: 'SystemRoleManage',
  mixins: [FormMixins],
  data() {
    return {
      loading: false,
      menus: [],
      rules: {
        Len50: getStringRule(1, 50),
        Int: getIntegerRule()
      }
    }
  },
  methods: {
    initData() {
      menusList().then(res => {
        this.menus = this.formatMenus(res)
      })
    },
    formatMenus(child) {
      let list = []

      if (child && child.length) {
        child.forEach(item => {
          list.push({ value: item.resId, label: item.resName })
          list = [...list, ...this.formatMenus(item.children)]
        })
      }
      return list
    },
    formatFormData() {
      if (this.options) {
        return {
          resId: this.options.resId,
          resName: this.options.resName,
          sort: this.options.sort,
          pid: this.options.pid,
          url: this.options.url,
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
          menusSave(this.form).then(() => {
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
