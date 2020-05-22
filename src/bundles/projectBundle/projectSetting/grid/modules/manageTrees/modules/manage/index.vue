<template>
  <el-dialog :title="isEdit ? '编辑网格':'新增网格'" :visible.sync="dialogVisible" width="800px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="上级">
        <span v-text="pNode.name"></span>
      </el-form-item>
      <el-form-item label="网格名称" prop="areaName" :rules="rules.Len50">
        <el-input v-model="form.areaName" placeholder="请输入网格名称"></el-input>
      </el-form-item>
      <el-form-item label="区域类型" prop="areaTypeId" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.areaTypeId" placeholder="请选择区域类型">
          <el-option class="jc-area-item" v-for="item in areaTypes" :key="item.id" :label="item.name" :value="item.id" :style="getIconStyle(item.icon)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="desc" :rules="rules.NOT_NULL">
        <jc-editor v-model="form.desc"></jc-editor>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { areaAdd, areaGet, areaUpdate } from '@/api/area'
import { areaTypeList } from '@/api/areaType'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { JcIcons } from '@/config/JcIconConfig'

let defaultForm = { areaName: '', desc: '', areaTypeId: '' }

export default {
  name: 'ProjectsProjectSettingGridManage',
  mixins: [FormMixins],
  props: ['pNode', 'projectId'],
  components: {
    JcEditor: () => import('@/components/JcForm/JcEditor')
  },
  data() {
    return {
      loading: false,
      areaTypes: [],
      rules: { NOT_NULL, SELECT_NOT_NULL, Len50: getStringRule(1, 50) }
    }
  },
  methods: {
    initData() {
      areaTypeList({}).then(res => {
        let areaTypes = []

        if (res && res.length) {
          res.forEach(item => {
            areaTypes.push({ id: item.areaTypeId, name: item.areaTypeName, icon: item.icon })
          })
        }
        this.areaTypes = areaTypes
      })
    },
    formatFormData() {
      if (this.options) {
        return { areaName: this.options.name, desc: this.options.desc, areaTypeId: this.options.areaTypeId }
      } else {
        return { ...defaultForm }
      }
    },
    getIconStyle(icon) {
      let useIcon = JcIcons[icon] || {}

      return `background-image: url(${useIcon.icon || ''});`
    },
    async save() {
      let areaSave = this.isEdit ? areaUpdate : areaAdd

      try {
        let params = { ...this.form, orgId: this.pNode.orgId, areaId: this.pNode.areaId, drawCoordinateType: 1, griddingUptType: 1 }

        if (!this.isEdit && this.pNode.areaId) {
          params.pid = this.pNode.areaId
        }
        const { areaId } = await areaSave(params)
        const item = await areaGet({ areaId })//获取区域信息

        this.$message.success('操作成功')
        this.dialogVisible = false
        this.$emit('save-success', { id: item.areaId, pid: item.pid, pName: this.pNode.name, orgId: item.orgId, areaId: item.areaId, desc: item.desc, areaTypeId: item.areaTypeId, name: item.areaName, icon: item.icon })
        this.loading = false
      } catch (error) {
        this.loading = false
      }
      return true
    },
    async onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save()
        } else {
          this.loading = false
        }
      })
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-area-item {
  background-repeat: no-repeat;
  background-size: auto 90%;
  background-position: 20px center;
  text-align: right;
}
</style>
