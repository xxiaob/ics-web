<template>
  <el-dialog :title="options ? options.view?'查看事件':'编辑事件' : '事件上报'" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <el-form-item label="事件ID" prop="eventNumber" v-show="view">
        <el-input v-model="form.eventNumber" :disabled="view" placeholder="请输入事件ID"></el-input>
      </el-form-item>
      <el-form-item label="上报人" prop="reportUserName" v-show="view">
        <el-input v-model="form.reportUserName" disabled></el-input>
      </el-form-item>
      <el-form-item prop="orgId" label="所属组织" v-show="view">
        <el-cascader :options="orgTree" disabled v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false }" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="事件标题" prop="eventTitle" :rules="rules.Len50">
        <el-input v-model="form.eventTitle" :disabled="view" placeholder="请输入事事件标题"></el-input>
      </el-form-item>
      <el-form-item label="事件描述" prop="desc" :rules="rules.NOT_NULL">
        <el-input v-model="form.desc" :disabled="view" placeholder="请输入事件描述" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="事件类型" prop="eventType" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.eventType" filterable remote reserve-keyword placeholder="请输入关键词" :disabled="view" :remote-method="remoteMethod" :loading="loading">
          <el-option v-for="item in eventTypes" :key="item.id" :label="item.typeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理前图片" prop="beforePhoto" :rules="[{required: true, message: '请上传文件'}]">
        <div v-if="view">
          <img v-for="url in form.beforePhoto" :key="url" :src="url" alt="" width="100%">
        </div>
        <upload v-show="!view" :urls.sync="form.beforePhoto" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"></upload>
      </el-form-item>
      <el-form-item label="处理后图片" prop="afterPhoto" :rules="[{required: true, message: '请上传文件'}]">
        <div v-if="view">
          <img v-for="url in form.afterPhoto" :key="url" :src="url" alt="" width="100%">
        </div>
        <upload v-show="!view" :urls.sync="form.afterPhoto" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"></upload>
      </el-form-item>
      <el-form-item label="视频文件" prop="videoAddr" :rules="[{required: true, message: '请上传文件'}]">
        <div v-if="view">
          <video v-for="url in form.videoAddr" :key="url" :src="url" alt="" width="100%" controls></video>
        </div>
        <upload v-show="!view" :urls.sync="form.videoAddr" accept="video/*"></upload>
      </el-form-item>
      <el-form-item label="音频文件" prop="audioAddr">
        <div v-if="view">
          <audio v-for="url in form.audioAddr" :key="url" :src="url" alt="" controls></audio>
        </div>
        <upload v-show="!view" :urls.sync="form.audioAddr" accept="audio/*"></upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-show="!view">
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
  eventType: '',
  desc: '',
  eventTitle: '',
  afterPhoto: [],
  audioAddr: [],
  beforePhoto: [],
  videoAddr: []
}

export default {
  name: 'SystemEventManageManage',
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
    upload: () => import('@/components/JcUpload')
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
      view: false,
      eventTypes: []
    }
  },
  created() {
    this.remoteMethod('')
  },
  methods: {
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
        this.view = this.options.view || false
        return {
          afterPhoto: this.options.afterPhoto,
          audioAddr: this.options.audioAddr,
          beforePhoto: this.options.beforePhoto,
          desc: this.options.desc,
          eventTitle: this.options.eventTitle,
          eventNumber: this.options.eventNumber,
          eventType: this.options.eventType.toString(),
          id: this.options.id,
          orgId: this.options.orgId,
          reportUserName: this.options.reportUserName,
          videoAddr: this.options.videoAddr
        }
      } else {
        this.view = false
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
    }
  }
}
</script>
