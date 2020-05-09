<template>
  <el-dialog :title="options ? options.view?'查看事件':'编辑事件' : '事件上报'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="事件ID" prop="eventNumber" :rules="rules.Len50">
        <el-input v-model="form.eventNumber" :disabled="view" placeholder="请输入事件ID"></el-input>
      </el-form-item>
      <el-form-item label="上报人" prop="reportUser" v-show="view">
        <el-input v-model="form.reportUser" disabled></el-input>
      </el-form-item>
      <!-- <el-form-item label="设备类型" prop="deviceType" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.deviceType" placeholder="选择设备类型" :disabled="view">
          <el-option v-for="(value,key) in deviceTypes" :key="key" :label="value" :value="key"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="所属组织" prop="orgId" :rules="rules.NOT_NULL">
        <el-input v-model="form.orgId" :disabled="view" placeholder="请输入所属组织"></el-input>
      </el-form-item>
      <el-form-item label="事件描述" prop="desc" :rules="rules.NOT_NULL">
        <el-input v-model="form.desc" :disabled="view" placeholder="请输入事件描述" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="事件类型" prop="eventType" :rules="rules.NOT_NULL">
        <el-input v-model="form.eventType" :disabled="view" placeholder="请输入事件类型"></el-input>
      </el-form-item>
      <el-form-item label="处理前图片" prop="beforePhoto" :rules="[{required: true, message: '请上传文件'}]">
        <el-input v-model="form.beforePhoto" v-show="false"></el-input>
        <img :src="form.beforePhoto" alt="" v-show="view">
        <upload v-show="!view" :url.sync="form.beforePhoto"></upload>
      </el-form-item>
      <el-form-item label="处理后图片" prop="afterPhoto" :rules="[{required: true, message: '请上传文件'}]">
        <el-input v-model="form.afterPhoto" v-show="false"></el-input>
        <img :src="form.afterPhoto" alt="" v-show="view">
        <upload v-show="!view" :url.sync="form.afterPhoto"></upload>
      </el-form-item>
      <el-form-item label="视频文件" prop="videoAddr" :rules="[{required: true, message: '请上传文件'}]">
        <el-input v-model="form.videoAddr" v-show="false"></el-input>
        <video :src="form.videoAddr" alt="" v-show="view"></video>
        <upload v-show="!view" :url.sync="form.videoAddr"></upload>
      </el-form-item>
      <el-form-item label="音频文件" prop="audioAddr" :rules="[{required: true, message: '请上传文件'}]">
        <el-input v-model="form.audioAddr" v-show="false"></el-input>
        <audio :src="form.audioAddr" alt="" v-show="view"></audio>
        <upload v-show="!view" :url.sync="form.audioAddr"></upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-show="!view">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { eventManageSave } from '@/api/eventManage'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import upload from './upload'

let defaultForm = {
  afterPhoto: '1',
  audioAddr: '1',
  beforePhoto: '1',
  desc: '',
  eventNumber: '',
  eventType: '',
  orgId: '',
  reportUser: '',
  videoAddr: '1'
}

export default {
  name: 'SystemEventManageManage',
  mixins: [FormMixins],
  components: {
    upload
  },
  data() {
    return {
      loading: false,
      menus: [],
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      view: false
    }
  },
  methods: {
    formatFormData() {
      if (this.options) {
        // this.fileList = [{ name: this.options.url, url: this.options.url }]
        this.view = this.options.view || false
        return {
          afterPhoto: this.options.afterPhoto,
          audioAddr: this.options.audioAddr,
          beforePhoto: this.options.beforePhoto,
          desc: this.options.desc,
          eventNumber: this.options.eventNumber,
          eventType: this.options.eventType,
          id: this.options.id,
          orgId: this.options.orgId,
          reportUser: this.options.reportUser,
          videoAddr: this.options.videoAddr
        }
      } else {
        // this.fileList = []
        this.view = false
        return { ...defaultForm }
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
