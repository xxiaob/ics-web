<template>
  <el-dialog title="督查" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="督查对象">
        <span>督查对象</span>
      </el-form-item>
      <el-form-item label="所属组织">
        <span>所属组织</span>
      </el-form-item>
      <el-form-item label="督查结果" prop="eventType" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.eventType" placeholder="请输入关键词">
          <el-option v-for="item in eventTypes" :key="item.id" :label="item.typeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="desc" :rules="rules.NOT_NULL">
        <el-input v-model="form.desc" placeholder="请输入备注" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { eventManageSave } from '@/api/eventManage'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'PeopleOverseeManage',
  mixins: [FormMixins],
  data() {
    return {
      loading: false,
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      eventTypes: []
    }
  },
  created() {
  },
  methods: {
    formatFormData() {
      if (this.options) {
        console.log('options', this.options)
        return {
          desc: this.options.desc,
          id: this.options.id,
          orgId: this.options.orgId
        }
      } else {
        return {}
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
    }
  }
}
</script>
