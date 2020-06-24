<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-detail-warp">
      <div class="jc-detail-label">所属组织</div>
      <div class="jc-detail-content">南京市</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">网格名称</div>
      <div class="jc-detail-content">南京市</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">网格类型</div>
      <div class="jc-detail-content">南京市</div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">网格类型</div>
      <div class="jc-detail-content">描述</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ScreenCommandGridDetailBaseInfo',
  data() {
    return {
      loading: false
    }
  }
}
</script>
