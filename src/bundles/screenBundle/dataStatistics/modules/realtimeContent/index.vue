<template>
  <div class="jc-flex-warp jc-flex-vertical">
    <!-- 监控视频 -->
    <jc-monitoring class="data-statistics-border js-monitoring"></jc-monitoring>

    <!-- 实时事件区域 -->
    <jc-event class="data-statistics-border"></jc-event>
  </div>
</template>

<script>
// 监控视频组件
import JcMonitoring from './module/monitoring'
import JcEvent from './module/event'

export default {
  name: 'ScreenDataStatisticsRealtimeContent',
  components: {
    JcMonitoring,
    JcEvent
  }
}
</script>

<style lang="scss" scoped>
.js-monitoring {
  margin-bottom: 20px;
}
</style>
