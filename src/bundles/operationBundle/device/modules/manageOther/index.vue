<template>
  <el-dialog title="编辑设备" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item prop="streamType" label="码流类型">
        <el-select v-model="form.streamType" placeholder="请选择码流类型" clearable>
          <el-option v-for="item in DEVICE_STREAM_TYPES.VALUES" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="protocol" label="协议类型">
        <el-select v-model="form.protocol" placeholder="请选择协议类型" clearable>
          <el-option v-for="item in DEVICE_PROTOCOL_TYPES.VALUES" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="transmode" label="通信类型">
        <el-select v-model="form.transmode" placeholder="请选择通信类型" clearable>
          <el-option v-for="item in DEVICE_TRANSMODE_TYPES.VALUES" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="expand" label="扩展字段">
        <el-input v-model="form.expand" placeholder="请输入扩展字段"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { updateDevice } from '@/api/device'
import { NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { DEVICE_TRANSMODE_TYPES, DEVICE_STREAM_TYPES, DEVICE_PROTOCOL_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'SystemDeviceManageOther',
  mixins: [FormMixins],
  data() {
    return {
      DEVICE_TRANSMODE_TYPES,
      DEVICE_STREAM_TYPES,
      DEVICE_PROTOCOL_TYPES,
      loading: false,
      rules: {
        NOT_NULL,
        SELECT_NOT_NULL
      }
    }
  },
  methods: {
    formatFormData() {
      if (this.options) {
        const { deviceId, transmode, streamType, protocol, expand } = this.options

        return {
          deviceId,
          transmode: typeof transmode != 'number' ? '' : transmode + '',
          streamType: typeof streamType != 'number' ? '' : streamType + '',
          protocol,
          expand
        }
      } else {
        return { transmode: DEVICE_TRANSMODE_TYPES.TCP, streamType: DEVICE_STREAM_TYPES.MAIN, protocol: DEVICE_PROTOCOL_TYPES.RTSP, expand: '' }
      }
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmSubmit()
        }
      })
    },
    async confirmSubmit() {
      this.loading = true
      try {
        await updateDevice({ ...this.form })
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.$emit('save-success')
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
