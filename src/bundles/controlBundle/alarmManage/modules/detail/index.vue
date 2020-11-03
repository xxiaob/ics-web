<template>
  <el-dialog title="告警详情" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose" top="15vh">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form" size="mini">

      <el-form-item label="信息来源：">
        <span>{{form.sources}}</span>
      </el-form-item>
      <el-form-item label="违建类型：">
        <span>{{form.mark}}</span>
      </el-form-item>
      <el-form-item label="建筑地址：">
        <span>{{form.address}}</span>
      </el-form-item>
      <el-form-item label="占地面积：">
        <span>{{form.land}}</span>
      </el-form-item>
      <el-form-item label="时间：">
        <span>{{form.createTime}}</span>
      </el-form-item>
      <el-form-item label="图斑：">
        <span>{{form.opinion}}</span>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>
<script>
import { eventManageGet } from '@/api/eventManage'
import MediaMixins from '@/bundles/taskBundle/mixins/MediaMixins'

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
  mixins: [MediaMixins],
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
      form: {},
      audios: []
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
      // this.audios = this.form.audioAddrs
      // this.audioPlayShows = new Array(this.audios.length).fill(true)
    },
    dialogClose() {
      this.$emit('update:visible', false)
    },
    download() {
      console.log('download')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/bundles/taskBundle/css/media.scss";
.dialog-footer {
  text-align: center;
}
</style>
