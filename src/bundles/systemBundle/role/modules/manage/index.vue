<template>
  <el-dialog :title="options ? '编辑角色':'新增角色'" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="角色名称" prop="roleName" :rules="rules.Len50">
        <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="所属组织" prop="orgId" :rules="rules.SELECT_NOT_NULL">
        <el-cascader v-model="form.orgId" :options="orgTree" filterable :props="{ expandTrigger: 'hover',checkStrictly: true,emitPath: false }" :disabled="isEdit"></el-cascader>
      </el-form-item>
      <el-form-item label="菜单权限" class="jc-menu-tree">
        <div>PC菜单权限</div>
        <!-- deviceType='' -->
        <menu-tree ref="pctree" :propMenuTree="menuTree" :resIds="resIds"></menu-tree>
      </el-form-item>
      <el-form-item label="" class="jc-menu-tree">
        <div>APP菜单权限</div>
        <!-- deviceType='2' -->
        <menu-tree ref="apptree" :propMenuTree="appMenuTree" :resIds="resIds"></menu-tree>
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
  components: {
    MenuTree: () => import('./menuTree')
  },
  data() {
    return {
      loading: false,
      orgTree: [],
      menuTree: [],
      appMenuTree: [],
      resIds: [],
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
        this.menuTree = res
      })
      menusGet('2').then(res => {
        this.appMenuTree = res
      })
    },
    formatOrgTree(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = { value: item.orgId, label: item.orgName }

          let children = this.formatOrgTree(item.children)

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
        const { roleId, roleName, orgId, resIds } = this.options

        this.resIds = resIds
        return { roleId, roleName, orgId }
      } else {
        this.resIds = []
        return { ...defaultForm, orgId: this.orgId }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          roleSave({ ...this.form, resIds: [...this.$refs.pctree.getCheckedKeys(), ...this.$refs.pctree.getHalfCheckedKeys(), ...this.$refs.apptree.getCheckedKeys(), ...this.$refs.apptree.getHalfCheckedKeys()] }).then(() => {
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
.jc-manage-form::after,
.jc-manage-form::before {
  content: "";
  clear: both;
  display: table;
}
.jc-menu-tree {
  width: 50%;
  float: left;
  /deep/ .el-tree {
    height: 360px;
    overflow: auto;
  }
}
</style>
