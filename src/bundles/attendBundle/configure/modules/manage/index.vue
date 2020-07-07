<template>
  <el-dialog :title="options ? '编辑配置' : '新增配置'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose" top="2vh">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form" size="small">
      <el-form-item label="考勤名称" prop="attendanceName" :rules="rules.Len50">
        <el-input v-model="form.attendanceName" placeholder="请输入考勤名称"></el-input>
      </el-form-item>
      <el-form-item label="上班时间" prop="startWorkTime" :rules="rules.SELECT_NOT_NULL">
        <el-time-picker v-model="form.startWorkTime" placeholder="请选择上班时间" value-format="HH:mm:ss">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="下班时间" prop="endWorkTime" :rules="rules.SELECT_NOT_NULL">
        <el-time-picker v-model="form.endWorkTime" placeholder="请选择下班时间" value-format="HH:mm:ss">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="启用" prop="enabled" :rules="rules.num" class="jc-left-width50">
        <el-switch v-model="form.enabled" :active-value="ATTEND_CONFIGURE_STATUSES.ENABLED" :inactive-value="ATTEND_CONFIGURE_STATUSES.NOTENABLED"></el-switch>
      </el-form-item>
      <el-form-item label="所属组织" prop="orgId" :rules="rules.SELECT_NOT_NULL">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
        <el-tree ref="tree" :data="orgTree" node-key="value" :filter-node-method="filterNode" :default-expanded-keys="orgTree.map(item=>item.value)" :current-node-key="form.orgId" @node-click="nodeClick" :expand-on-click-node="false" :highlight-current="true"></el-tree>
      </el-form-item>
      <el-form-item label="人员选择" prop="userIds" :rules="rules.SELECT_NOT_NULL">
        <!-- <el-select v-model="form.userIds" multiple placeholder="请选择人员">
          <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId">
          </el-option>
        </el-select> -->
        <jc-people :selecteds.sync="form.userIds" :tree="users"></jc-people>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { cfgSave } from '@/api/attend'
import { userListByOrg } from '@/api/user'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL, getNumberRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { ATTEND_CONFIGURE_STATUSES } from '@/constant/Dictionaries'

let defaultForm = {
  attendanceName: '',
  startWorkTime: '09:00:00',
  endWorkTime: '18:00:00',
  enabled: ATTEND_CONFIGURE_STATUSES.ENABLED,
  orgId: '',
  userIds: []
}

export default {
  name: 'ConfigureManage',
  mixins: [FormMixins],
  props: {
    orgTree: {
      type: Array
    },
    orgId: {
      type: String
    }
  },
  components: {
    JcPeople: () => import('./people')
  },
  data() {
    return {
      ATTEND_CONFIGURE_STATUSES,
      filterText: '',
      loading: false,
      rules: {
        Len50: getStringRule(1, 50),
        num: getNumberRule(false),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      users: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    formatFormData() {
      if (this.options) {
        const { id, attendanceName, startWorkTime, endWorkTime, enabled, orgId, userIds } = this.options

        if (orgId) {
          this.getUsers(orgId)
          if (this.$refs.tree) {
            this.$refs.tree.setCurrentKey(orgId)
          }
        }
        return { id, attendanceName, startWorkTime, endWorkTime, enabled, orgId, userIds }
      } else {
        if (this.orgId) {
          this.getUsers(this.orgId)
          if (this.$refs.tree) {
            this.$refs.tree.setCurrentKey(this.orgId)
          }
        }
        return { ...defaultForm, orgId: this.orgId }
      }
    },
    async getUsers(orgId) {
      const res = await userListByOrg([orgId])

      this.users = res.map(item=>({ id: item.userId, label: item.userName }))
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          cfgSave(this.form).then(() => {
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
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.label.indexOf(value) !== -1
    },
    nodeClick(data) {
      // console.log(data)
      this.form.orgId = data.value
      this.getUsers(data.value)
      this.form.userIds = []
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tree {
  height: 200px;
  overflow: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
