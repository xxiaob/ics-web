<template>
  <el-dialog :title="options ? '编辑配置' : '新增配置'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="考勤名称" prop="eventTitle" :rules="rules.Len50">
        <el-input v-model="form.eventTitle" placeholder="请输入考勤名称"></el-input>
      </el-form-item>
      <el-form-item label="打卡时间" prop="eventType" :rules="rules.SELECT_NOT_NULL">
        <el-time-picker v-model="form.eventType" placeholder="请选择打卡时间" value-format="HH:mm:ss">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="所属组织" prop="orgId" :rules="rules.SELECT_NOT_NULL">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
        <el-tree ref="tree" :data="orgTree" node-key="value" :filter-node-method="filterNode" :default-expanded-keys="orgTree.map(item=>item.value)" :current-node-key="orgId" @node-click="nodeClick" :expand-on-click-node="false" :highlight-current="true"></el-tree>
      </el-form-item>
      <el-form-item label="人员选择" prop="orgId" :rules="rules.SELECT_NOT_NULL">

      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { eventManageSave, eventManageTypeList } from '@/api/eventManage'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = {
  orgId: '',
  eventType: '09:00:00',
  desc: '',
  eventTitle: ''
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
  data() {
    return {
      filterText: '',
      loading: false,
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      eventTypes: []
    }
  },
  watch: {
    orgId: {
      immediate: true,
      handler(val) {
        if (val) {
          console.log('orgId', val)
        }
      },
      deep: true
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.remoteMethod('')
  },
  methods: {
    //获取配置类型
    async remoteMethod(query) {
      this.loading = true
      try {
        this.eventTypes = await eventManageTypeList(query)
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },
    formatFormData() {
      if (this.options) {
        return { ...this.options }
      } else {
        return { ...defaultForm, orgId: this.orgId }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          eventManageSave(this.form).then(() => {
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
      console.log(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-myeditor {
  height: 200px;
  /deep/ .w-e-text-container {
    height: 160px !important;
  }
}
.el-textarea /deep/ textarea {
  font-family: "微软雅黑", "Microsoft Yahei", "Helvetica Naue", Helvetica,
    sans-serif !important;
}
.el-tree {
  height: 200px;
  overflow: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
