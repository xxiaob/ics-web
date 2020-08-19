<template>
  <el-dialog title="绑定用户" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="所属组织">
        <el-cascader v-model="manageOrgId" :options="orgTree" filterable :props="{ expandTrigger: 'hover',checkStrictly: true, emitPath: false }" @change="orgChange" ref="orgCascader"></el-cascader>
      </el-form-item>
      <el-form-item label="用户名称" prop="userId" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.userId" placeholder="请选择用户" filterable>
          <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId">
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
import { deviceBind } from '@/api/device'
import { organizationList } from '@/api/organization'
import { userListByOrg } from '@/api/user'
import { SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'SystemDeviceManage',
  mixins: [FormMixins],
  props: ['orgId'],
  data() {
    return {
      manageOrgId: '',
      loading: false,
      orgTree: [],
      props: {
        children: 'children',
        label: 'resName'
      },
      rules: {
        SELECT_NOT_NULL
      },
      users: []
    }
  },
  methods: {
    orgChange(v) {
      console.log('orgChange', v)
      this.getUsers(v)
      this.$refs.orgCascader.dropDownVisible = false //级联选择器 选择任意一级后隐藏下拉框
    },
    initData() {
      organizationList().then(res => {
        this.orgTree = this.formatOrgTree(res)
        this.manageOrgId = this.orgId
        this.getUsers(this.orgId)
      })
    },
    async getUsers(orgId) {
      this.users = await userListByOrg([orgId])
      this.form.userId = ''
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
    formatFormData() {
      if (this.options) {
        const { deviceId, deviceType } = this.options

        return { userId: '', deviceId, deviceType }
      } else {
        return { userId: '' }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          deviceBind({ ...this.form }).then(() => {
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
