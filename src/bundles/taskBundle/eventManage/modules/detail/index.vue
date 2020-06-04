<template>
  <el-dialog title="事件详情" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form" size="small">
      <el-form-item label="事件ID">
        <span>{{form.eventNumber}}</span>
      </el-form-item>
      <el-form-item label="上报人">
        <span>{{form.reportUserName}}</span>
      </el-form-item>
      <el-form-item label="所属组织">
        <span>{{form.orgName}}</span>
      </el-form-item>
      <el-form-item label="事件标题">
        <span>{{form.eventTitle}}</span>
      </el-form-item>
      <el-form-item label="事件描述">
        <span>{{form.desc}}</span>
      </el-form-item>
      <el-form-item label="事件类型">
        <span>{{form.typeName}}</span>
      </el-form-item>
      <el-form-item label="处理前图片">
        <img v-for="url in form.beforePhotos" :key="url" :src="url" alt="" width="100%">
      </el-form-item>
      <el-form-item label="处理后图片">
        <img v-for="url in form.afterPhotos" :key="url" :src="url" alt="" width="100%">
      </el-form-item>
      <el-form-item label="视频文件">
        <video v-for="url in form.videoAddrs" :key="url" :src="url" alt="" width="100%" controls></video>
      </el-form-item>
      <el-form-item label="音频文件" prop="audioAddr">
        <audio v-for="url in form.audioAddrs" :key="url" :src="url" alt="" controls></audio>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { eventManageGet } from '@/api/eventManage'

export default {
  name: 'EventManageDetail',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: ()=>{}
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.dialogVisible = true
      }
    },
    info: {
      // immediate: true,
      deep: true,
      handler() {
        this.getDetail()
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {}
    }
  },
  created() {
    if (this.info && this.info.id) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      const res = await eventManageGet(this.info.id)

      this.form = { ...this.info, ...res }
    },
    dialogClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
