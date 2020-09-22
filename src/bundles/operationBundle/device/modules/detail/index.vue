<template>
  <el-dialog title="设备详情" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form" size="mini">
      <el-form-item label="所属组织：">
        <span>{{form.orgName}}</span>
      </el-form-item>
      <el-form-item label="设备编号：">
        <span>{{form.deviceCode}}</span>
      </el-form-item>
      <el-form-item label="设备名称：">
        <span>{{form.deviceName}}</span>
      </el-form-item>
      <el-form-item label="设备类型：">
        <span>{{form.deviceTypeName}}</span>
      </el-form-item>
      <el-form-item label="设备状态：">
        <span>{{form.online?'在线':'离线'}}</span>
      </el-form-item>
      <!-- <el-form-item label="设备序列号：">
        <span>{{form.deviceSeriNum}}</span>
      </el-form-item> -->
      <el-form-item label="接入协议：">
        <span>{{form.treatyType}}</span>
      </el-form-item>
      <el-form-item label="设备位置：">
        <span>{{form.positionName}}</span>
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
