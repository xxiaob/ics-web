<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-detail-warp">
      <div class="jc-detail-label">事件标题</div>
      <div class="jc-detail-content"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ScreenCommandMessageDetailTask',
  props: ['options'],
  data() {
    return {
      loading: false
    }
  },
  methods: {

  }
}
</script>
