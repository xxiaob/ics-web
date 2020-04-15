<template>
  <el-dialog :title="options ? '编辑用户':'新增用户'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="85px" :model="form" class="jc-manage-form">
      <el-form-item label="用户名称" prop="userName" :rules="rules.Len50">
        <el-input v-model="form.userName" placeholder="请输入用户名称"></el-input>
      </el-form-item>
      <el-form-item label="登录账号" prop="account" :rules="rules.Len50">
        <el-input v-model="form.account" placeholder="请输入登录账号"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone" :rules="rules.Tel">
        <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="执法证号" prop="lawNbr">
        <el-input v-model="form.lawNbr" placeholder="请输入执法证号"></el-input>
      </el-form-item>
      <el-form-item label="胸牌号" prop="chestNbr">
        <el-input v-model="form.chestNbr" placeholder="请输入胸牌号"></el-input>
      </el-form-item>
      <el-form-item label="职位" prop="positionId" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.positionId" placeholder="职位">
          <el-option v-for="item in positions" :key="item.positionId" :label="item.positionName" :value="item.positionId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="默认接收人">
        <el-switch v-model="form.isDefReceiver" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="所属组织" prop="orgId" :rules="rules.SELECT_NOT_NULL">
        <el-cascader v-model="form.orgId" :options="orgTree" filterable :props="{ expandTrigger: 'hover',checkStrictly: true,emitPath: false }" :disabled="isEdit"></el-cascader>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.roleIds" multiple placeholder="角色">
          <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
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
import { userSave } from '@/api/user'
import { roleListAll } from '@/api/role'
import { organizationList } from '@/api/organization'
import { positionListAll } from '@/api/position'
import { getStringRule, SELECT_NOT_NULL, getTelRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { userName: '', account: '', phone: '', positionId: '', chestNbr: '', lawNbr: '', isDefReceiver: '0' }

export default {
  name: 'SystemUserManage',
  mixins: [FormMixins],
  props: ['orgId'],
  data() {
    return {
      loading: false,
      orgTree: [],
      positions: [],
      roles: [],
      props: {
        children: 'children',
        label: 'resName'
      },
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL,
        Tel: getTelRule()
      }
    }
  },
  methods: {
    initData() {
      organizationList().then(res => {
        this.orgTree = this.formatOrgTree(res)
      })
      roleListAll().then(res => {
        let list = []

        if (res && res.length) {
          res.forEach(item => {
            list.push({ roleId: item.roleId, roleName: item.roleName })
          })
        }
        this.roles = list
      })
      positionListAll().then(res => {
        let list = []

        if (res && res.length) {
          res.forEach(item => {
            list.push({ positionId: item.positionId, positionName: item.positionName })
          })
        }
        this.positions = list
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
    formatFormData() {
      if (this.options) {
        return {
          userId: this.options.userId,
          userName: this.options.userName,
          account: this.options.account,
          phone: this.options.phone,
          chestNbr: this.options.chestNbr,
          lawNbr: this.options.lawNbr,
          isDefReceiver: this.options.isDefReceiver,
          roleIds: this.options.roleIds || [],
          orgId: this.options.orgId,
          positionId: this.options.positionId
        }
      } else {
        return { ...defaultForm, orgId: this.orgId, roleIds: [] }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          userSave(this.form).then(() => {
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
