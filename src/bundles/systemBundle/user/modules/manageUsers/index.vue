<template>
  <el-dialog title="批量人员导入" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose">
    <el-form ref="form" label-width="110px" :model="form" class="jc-manage-form">
      <el-form-item label="所属组织" prop="orgId" :rules="rules.SELECT_NOT_NULL">
        <el-cascader v-model="form.orgId" :options="orgTree" filterable @change="orgChange" :props="{ expandTrigger: 'hover',checkStrictly: true,emitPath: false }" :disabled="isEdit"></el-cascader>
      </el-form-item>
      <el-form-item label="职位" prop="positionIds" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.positionIds" placeholder="职位" multiple>
          <el-option v-for="item in positions" :key="item.positionId" :label="item.positionName" :value="item.positionId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.roleIds" multiple placeholder="角色">
          <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人员信息表格" prop="file" :rules="[{required: true, message: '请上传文件'}]">
        <a class="jc-a" href="/static/excels/批量人员导入表格模板.xlsx" download="人员信息表格模板.xlsx">人员信息表格模板.xlsx</a>
        <form enctype="multipart/form-data" v-if="dialogVisible">
          <input ref="myfile" type="file" name="file" accept=".xlsx,.xls" @change="myfileChange"/>
        </form>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { importUsers } from '@/api/user'
import { roleListAll } from '@/api/role'
import { organizationList } from '@/api/organization'
import { positionListAll } from '@/api/position'
import { SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'SystemUserManageUsers',
  mixins: [FormMixins],
  props: ['orgId'],
  data() {
    return {
      loading: false,
      orgTree: [],
      positions: [],
      roles: [],
      props: { children: 'children', label: 'resName' },
      rules: {
        SELECT_NOT_NULL
      }
    }
  },
  methods: {
    initData() {
      organizationList().then(res => {
        this.orgTree = this.formatOrgTree(res)
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
      //如果组织id存在则取获取角色数组
      if (this.form.orgId) {
        this.orgChange(this.form.orgId)
      }
    },
    formatOrgTree(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          trees.push({ value: item.orgId, label: item.orgName, ...(item.children && item.children.length ? { children: this.formatOrgTree(item.children) } : {}) })
        })
      }
      return trees
    },
    orgChange(orgId) {
      //组织变化
      console.log('orgChange', orgId)
      if (orgId != this.form.orgId) {
        this.form.roleIds = []
      }
      roleListAll(orgId).then(res => {
        let list = []

        if (res && res.length) {
          res.forEach(item => {
            list.push({ roleId: item.roleId, roleName: item.roleName })
          })
        }
        this.roles = list
      })
    },
    formatFormData() {
      return { orgId: this.orgId, roleIds: [], positionIds: [], file: null }
    },
    myfileChange(e) {
      // console.log('myfileChange', e.target.files[0])
      this.form.file = e.target.files[0]
    },
    onSubmit() {
      // console.log(this.$refs.myfile.files[0])
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            const res = await importUsers(this.form)

            if (res) {
              console.log('importUsers res', res)
            } else {
              this.$message.success('操作成功')
            }
            this.dialogVisible = false
            this.$emit('save-success')
            this.loading = false
          } catch (error) {
            console.error(error)
            this.loading = false
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-a{
  text-decoration: none;
}
</style>
