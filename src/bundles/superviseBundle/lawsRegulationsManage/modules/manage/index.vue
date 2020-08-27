<template>
  <el-dialog :title="options? '编辑法律法规': '新增法律法规'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose">
    <el-form ref="form" label-width="120px" :model="form" class="jc-manage-form">
      <el-form-item label="法规类型" prop="statuteType" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.statuteType" placeholder="选择法规类型">
          <el-option v-for="item in types" :key="item.id" :label="item.configName" :value="item.configValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="法规名称" prop="statuteName">
        <el-input v-model="form.statuteName" placeholder="请输入法规名称"></el-input>
      </el-form-item>
      <el-form-item label="法规描述" prop="statuteDesc">
        <el-input v-model="form.statuteDesc" resize="none" placeholder="请输入法规描述"></el-input>
      </el-form-item>

      <el-form-item label="法规内容" prop="statuteText">
        <el-input v-model="form.statuteText" type="textarea" :rows="4" resize="none" placeholder="请输入法规内容"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { statuteSave } from '@/api/supervise'
import { getStringRule, SELECT_NOT_NULL, getTelRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { statuteType: '', statuteName: '', statuteDesc: '', statuteText: '' }

export default {
  name: 'lawsRegulationsIndexManage',
  mixins: [FormMixins],
  props: {
    types: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      props: { children: 'children', label: 'resName' },
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL,
        Tel: getTelRule()
      }
    }
  },
  methods: {
    formatFormData() {
      console.log('this.options', this.options)
      if (this.options) {
        return {
          statuteType: this.options.statuteType,
          statuteName: this.options.statuteName,
          statuteDesc: this.options.statuteDesc,
          statuteText: this.options.statuteText,
          id: this.options.id
        }
      } else {
        return { ...defaultForm }
      }
    },
    onSubmit() {
      this.loading = true

      this.$refs.form.validate(valid => {
        console.log('valid', valid)

        console.log('this.form', this.form)
        if (valid) {
          statuteSave(this.form).then(() => {
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
