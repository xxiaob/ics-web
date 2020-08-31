<template>
  <el-dialog :title="options ? '第三方详情编辑':'第三方新增'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose">
    <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form">
      <el-form-item label="第三方名称" prop="thirdPartyName" :rules="rules.Len50">
        <el-input v-model.trim="form.thirdPartyName" placeholder="请输入第三方名称"></el-input>
      </el-form-item>
      <el-form-item label="所属组织" prop="orgId" :rules="rules.SELECT_NOT_NULL" v-if="!isEdit">
        <el-cascader v-model="form.orgId" :options="orgTree" formatter="data" filterable @change="orgChange" :props="{ expandTrigger: 'hover',checkStrictly: true,emitPath: false }"></el-cascader>
      </el-form-item>
      <el-form-item label="授权截止时间" prop="endTime" :rules="rules.SELECT_NOT_NULL">
        <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="" class="thirdTip">
        <span v-if="isEdit">修改后将生成新的appsecret</span>
        <span v-else>设置后将生成appkey和appsecret</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { operationSave } from '@/api/operation'
import { organizationList } from '@/api/organization'
import { getStringRule, SELECT_NOT_NULL, getTelRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { thirdPartyName: '', endTime: null }

export default {
  name: 'SystemUserManage',
  mixins: [FormMixins],
  props: {
    options: {
      type: Object
    }
  },
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
      orgId: null
    }
  },
  methods: {
    initData() {
      organizationList().then(res => {
        this.orgTree = this.formatOrgTree(res)
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
      // console.log('orgChange', orgId)
      // console.log('this.form', this.form)
      if (orgId != this.form.orgId) {
        this.form.roleIds = []
      }
    },
    formatFormData() {
      // 处理新增和编辑的数据
      // console.log('this.options', this.options)
      if (this.options) {
        return {
          id: this.options.id,
          thirdPartyName: this.options.thirdPartyName,
          endTime: this.options.endTime,
          orgId: this.options.orgId,
          appKey: this.options.appKey,
          appSecret: this.options.appSecret
        }
      } else {
        return { ...defaultForm, orgId: this.orgId }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log('valid', valid)
          console.log('form', this.form)

          operationSave({
            ...this.form,
            endTime: new Date(this.form.endTime)
          }).then(() => {
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
.thirdTip {
  color: #999;
  margin-bottom: 0;
  & >>> .el-form-item__content {
    line-height: 1.1;
  }
}
</style>
