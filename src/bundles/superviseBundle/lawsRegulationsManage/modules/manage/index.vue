<template>
  <el-dialog title="新增法律法规" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose">
    <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form">
      <el-form-item label="法规类型" prop="thridName" :rules="rules.Len50">
        <el-select v-model="form.lawsType" placeholder="选择法规类型">
          <el-option v-for="item in types" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="法规名称" prop="orgId" :rules="rules.SELECT_NOT_NULL">
        <el-input v-model="form.lawsInfo" placeholder="请输入法规名称"></el-input>
      </el-form-item>
      <el-form-item label="法规描述" prop="orgId" :rules="rules.SELECT_NOT_NULL">
        <el-input v-model="form.lawsInfo" type="textarea" :rows="2" resize="none" placeholder="请输入法规描述"></el-input>
      </el-form-item>

      <el-form-item label="上传文档" prop="orgId" :rules="rules.SELECT_NOT_NULL">

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

let defaultForm = { thridName: '', endTime: null }

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
      props: { children: 'children', label: 'resName' },
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL,
        Tel: getTelRule()
      },
      endTime: null,
      types: [
        {
          id: 1,
          typeName: '国家法律'
        },
        {
          id: 2,
          typeName: '行政法规'
        },
        {
          id: 3,
          typeName: '地方性法规'
        },
        {
          id: 4,
          typeName: '政府规章'
        },
        {
          id: 5,
          typeName: '其他'
        }
      ]
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
    accountChange() {
      //账号输入处理
      if (this.form.account) {
        this.form.account = this.form.account.replace(/\s*/g, '').replace(/[`~!@#$^&*()=|{}':;'.,'\\。，、？%+_]/g, '').replace(/[\u4e00-\u9fa5]/g, '')
      }
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
