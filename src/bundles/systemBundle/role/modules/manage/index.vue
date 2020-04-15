<template>
  <el-dialog :title="options ? '编辑角色':'新增角色'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="角色名称" prop="roleName" :rules="rules.Len50">
        <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="所属组织" prop="orgId" :rules="rules.SELECT_NOT_NULL">
        <el-cascader v-model="form.orgId" :options="orgTree" filterable :props="{ expandTrigger: 'hover',checkStrictly: true,emitPath: false }"></el-cascader>
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-tree ref="tree" :data="menuTree" :props="props" node-key="resId" :default-expand-all="true" :show-checkbox="true"></el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { roleSave } from '@/api/role'
import { menusGet } from '@/api/menus'
import { organizationList } from '@/api/organization'
import { getStringRule, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { roleName: '' }

export default {
  name: 'SystemRoleManage',
  mixins: [FormMixins],
  props: ['orgId'],
  data() {
    return {
      loading: false,
      orgTree: [],
      menuTree: [],
      props: {
        children: 'children',
        label: 'resName'
      },
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL
      }
    }
  },
  methods: {
    initData() {
      organizationList().then(res => {
        this.orgTree = this.formatOrgTree(res)
      })
      menusGet().then(res => {
        this.menuTree = this.formatMenuTree(res)
      })
    },
    formatOrgTree(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = {
            value: item.orgId,
            label: item.orgName
          }

          let children = this.formatOrgTree(item.children)

          if (children && children.length) {
            node.children = children
          }

          trees.push(node)
        })
      }
      return trees
    },
    formatMenuTree(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = {
            resId: item.resId,
            resName: item.resName
          }

          let children = this.formatMenuTree(item.children)

          if (children && children.length) {
            node.children = children
          }

          trees.push(node)
        })
      }
      return trees
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
        return { ...defaultForm, orgId: this.orgId }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          roleSave({ ...this.form, resIds: this.$refs.tree.getCheckedKeys() }).then(() => {
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
