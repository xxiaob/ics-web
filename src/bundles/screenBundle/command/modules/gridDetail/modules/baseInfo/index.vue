<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-detail-warp">
      <div class="jc-detail-label">所属组织</div>
      <div class="jc-detail-content" v-text="detail.orgName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">网格名称</div>
      <div class="jc-detail-content" v-text="detail.areaName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">网格类型</div>
      <div class="jc-detail-content" v-text="detail.areaTypeName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">描述</div>
    </div>
    <div class="jc-edit-content" v-html="detail.desc"></div>
  </div>
</template>
<script>
import { getAreaInfoById } from '@/api/area'

export default {
  name: 'ScreenCommandGridDetailBaseInfo',
  props: ['options', 'project'],
  data() {
    return {
      loading: false,
      detail: {}
    }
  },
  watch: {
    options() {
      this.initData()
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      this.detail = {}
      try {
        this.detail = await getAreaInfoById(this.options.areaId)
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>
