<template>
  <div class="jc-flex-warp jc-flex-vertical">
      <jc-monitoring class="jc-flex-con data-statistics-border js-monitoring">

      </jc-monitoring>
      <div class="jc-flex-con data-statistics-border">
          
      </div>
  </div>
</template>

<script>
// 监控视频组件
import JcMonitoring from './module/monitoring'

export default {
    name: 'ScreenDataStatisticsRealtimeContent',
    components: {
        JcMonitoring
    }
}
</script>

<style lang="scss" scoped>
    .js-monitoring {
        margin-bottom:20px;
        padding: 0 16px 16px;
    }
</style>