<template>
  <el-dialog title="告警详情" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose" top="15vh">
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form" size="mini">

      <el-form-item label="信息来源：">
        <span>{{form.source}}</span>
      </el-form-item>
      <el-form-item label="违建类型：">
        <span>{{form.remark}}</span>
      </el-form-item>
      <el-form-item label="建筑地址：">
        <span>{{form.positionName}}</span>
      </el-form-item>
      <el-form-item label="占地面积：">
        <span>{{form.areaCovered}}</span>
      </el-form-item>
      <el-form-item label="时间：">
        <span>{{form.createDate| filterTime}}</span>
      </el-form-item>
      <el-form-item label="图斑：">
        <el-image v-for="url in form.photos" :key="url" :src="url" :preview-src-list="form.photos"  class="jc-img"></el-image>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>

import { formatDate } from '@/libs/util'
export default {
  name: 'alarmManageDetail',
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
  filters: {
    filterTime(value) {
      return formatDate(value)
    }
  },
  methods: {
    async getDetail() {
      this.form = { ...this.info }
    },
    dialogClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/bundles/taskBundle/css/media.scss";

</style>
