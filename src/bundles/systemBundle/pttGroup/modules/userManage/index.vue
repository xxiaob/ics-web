<template>
  <el-dialog title="新增用户" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="群组用户" prop="userIds" :rules="rules.SELECT_NOT_NULL">
        <el-cascader :options="orgTree" v-model="orgIds" :props="{expandTrigger: 'hover', emitPath: false, multiple: true ,checkStrictly: true}" clearable placeholder="请选择组织" :show-all-levels="false" @change="changeOrg" class="jc-left-width50"></el-cascader>
        <el-select v-model="form.userIds" multiple placeholder="请选择用户" clearable class="jc-left-width50">
          <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { userAdd } from '@/api/pttGroup'
import { organizationList } from '@/api/organization'
import { userListByOrg } from '@/api/user'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'SystemPttGroupUserManage',
  mixins: [FormMixins],
  props: {
    groupId: String
  },
  data() {
    return {
      loading: false,
      rules: {
        Len20: getStringRule(1, 20),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      orgTree: [],
      orgIds: [],
      users: []
    }
  },
  created() {
    this.getOrgTree()
  },
  methods: {
    async getOrgTree() {
      const res = await organizationList()

      this.orgTree = this.formatOrgTree(res)
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
    changeOrg(orgIds) {
      if (orgIds.length) {
        this.getUser(orgIds)
      } else {
        this.userIds = []
      }
      this.form.userIds = []
    },
    async getUser(orgIds) {
      try {
        const res = await userListByOrg(orgIds)
        const users = []

        if (res && res.length) {
          res.forEach(item=>{
            users.push({
              id: item.userId,
              name: item.userName
            })
          })
        }
        this.users = users
      } catch (error) {
        console.error(error)
      }
    },
    formatFormData() {
      this.orgIds = []
      return { userIds: [] }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          userAdd({ groupId: this.groupId, ...this.form }).then(() => {
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
.jc-left-width50 {
  width: 50%;
  float: left;
}
</style>
