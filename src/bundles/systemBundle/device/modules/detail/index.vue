<template>
  <el-dialog title="设备详情" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="所属组织">
        <span>{{form.orgName}}</span>
      </el-form-item>
      <el-form-item label="设备名称">
        <span>{{form.orgName}}</span>
      </el-form-item>
      <el-form-item label="设备类型">
        <span>{{form.orgName}}</span>
      </el-form-item>
      <el-form-item label="接入协议">
        <span>{{form.orgName}}</span>
      </el-form-item>
      <el-form-item label="描述">
        <span>{{form.orgName}}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'SystemDeviceDetail',
  mixins: [FormMixins],
  data() {
    return {}
  },
  methods: {
    formatFormData() {
      if (this.options) {
        return { ...this.options }
      } else {
        return {}
      }
    }
  }
}
</script>
