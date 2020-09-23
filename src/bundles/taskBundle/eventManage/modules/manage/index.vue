<template>
  <el-dialog :title="options ? '编辑事件' : '事件上报'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form">
      <!-- <el-form-item label="事件ID" prop="eventNumber" v-show="view">
        <el-input v-model="form.eventNumber"  placeholder="请输入事件ID"></el-input>
      </el-form-item>
      <el-form-item label="上报人" prop="reportUserName" v-show="view">
        <el-input v-model="form.reportUserName" disabled></el-input>
      </el-form-item>
      <el-form-item prop="orgId" label="所属组织" v-show="view">
        <el-cascader :options="orgTree" disabled v-model="form.orgId" :props="{expandTrigger: 'hover', emitPath: false }" clearable></el-cascader>
      </el-form-item> -->
      <el-form-item label="事件标题" prop="eventTitle" :rules="rules.Len50">
        <el-input v-model="form.eventTitle" placeholder="请输入事件标题"></el-input>
      </el-form-item>
      <el-form-item label="事件类型" prop="eventType" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.eventType" filterable placeholder="请选择事件类型">
          <el-option v-for="item in eventTypes" :key="item.id" :label="item.typeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事件描述" prop="desc" :rules="rules.Len100">
        <el-input v-model="form.desc" placeholder="请输入事件描述" type="textarea"></el-input>
        <!-- <jc-editor v-model="form.desc"></jc-editor> -->
      </el-form-item>
      <el-form-item label="处理前图片" prop="beforePhoto" :rules="[{required: true, message: '请上传文件'}]">
        <upload :show="dialogVisible" :urls.sync="form.beforePhoto" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"></upload>
      </el-form-item>
      <el-form-item label="处理后图片" prop="afterPhoto" :rules="[{required: true, message: '请上传文件'}]">
        <upload :show="dialogVisible" :urls.sync="form.afterPhoto" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"></upload>
      </el-form-item>
      <el-form-item label="视频文件" prop="videoAddr" :rules="[{required: true, message: '请上传文件'}]">
        <upload :show="dialogVisible" :urls.sync="form.videoAddr" accept="video/*"></upload>
      </el-form-item>
      <el-form-item label="音频文件" prop="audioAddr">
        <upload :show="dialogVisible" :urls.sync="form.audioAddr" accept="audio/*"></upload>
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
  eventType: '',
  desc: '',
  eventTitle: '',
  afterPhoto: [],
  audioAddr: [],
  beforePhoto: [],
  videoAddr: []
}

export default {
  name: 'EventManageManage',
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
    upload: () => import('@/components/JcUpload'),
    JcEditor: () => import('@/components/JcForm/JcEditor')
  },
  data() {
    return {
      loading: false,
      rules: {
        Len50: getStringRule(1, 50),
        Len100: getStringRule(1, 100),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      eventTypes: []
    }
  },
  created() {
    this.remoteMethod('')
  },
  methods: {
    //获取事件类型
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
        return {
          afterPhoto: this.options.afterPhotos,
          audioAddr: this.options.audioAddrs,
          beforePhoto: this.options.beforePhotos,
          desc: this.options.desc,
          eventTitle: this.options.eventTitle,
          eventNumber: this.options.eventNumber,
          eventType: this.options.eventType,
          // eventType: this.options.eventType.toString(),
          id: this.options.id,
          orgId: this.options.orgId,
          reportUserName: this.options.reportUserName,
          videoAddr: this.options.videoAddrs
        }
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
</style>
