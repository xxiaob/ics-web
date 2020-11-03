<template>
  <el-dialog title="新增设备" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item prop="deviceName" label="设备名称" :rules="rules.NOT_NULL">
        <el-input v-model="form.deviceName" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item prop="deviceSource" label="设备来源" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.deviceSource" placeholder="设备来源">
          <el-option v-for="item in DEVICE_SOURCES.VALUES" :key="item.value" :label="item.label" :value="item.value" :disabled="item.value==DEVICE_SOURCES.HANKER"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="form.deviceSource==DEVICE_SOURCES.FIXEDFLOW">
        <el-form-item prop="url" label="固定流地址" :rules="rules.NOT_NULL">
          <el-input v-model="form.url" placeholder="请输入固定流地址"></el-input>
        </el-form-item>
        <el-form-item label="设备位置" prop="location" :rules="rules.NOT_NULL">
          <el-input v-model="form.location" style="display:none"></el-input>
          <span>{{locationName}}</span>
        </el-form-item>
        <el-form-item>
          <div class="jc-map-tip">右键点击地图选中位置</div>
          <div class="jc-map">
            <map-user-marker v-model="location" :isGetUser="false"></map-user-marker>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addDevice } from '@/api/device'
import { NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { DEVICE_SOURCES } from '@/constant/Dictionaries'

export default {
  name: 'SystemDeviceManage',
  mixins: [FormMixins],
  components: {
    MapUserMarker: () => import('@/components/JcMap/MapUserMarker')
  },
  data() {
    return {
      DEVICE_SOURCES,
      loading: false,
      rules: {
        NOT_NULL,
        SELECT_NOT_NULL
      },
      location: {},
      locationName: ''
    }
  },
  watch: {
    location: {
      handler(val) {
        this.form.location = val.position
        this.locationName = val.name
      },
      deep: true
    }
  },
  methods: {
    formatFormData() {
      return { deviceName: '', deviceSource: DEVICE_SOURCES.LAW, url: '', location: '' }
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
        await addDevice({ ...this.form })
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
.jc-map {
  height: 250px;
  line-height: normal;
  position: relative;
}
.jc-map-tip {
  color: red;
  font-size: 12px;
  line-height: normal;
}
</style>
