<template>
  <div class="jc-other-info jc-flex-warp jc-flex-vertical">
    <!-- 气象信息 -->
    <div class="jc-weather-info data-statistics-border jc-flex-con-2"></div>

    <!-- 出勤信息 -->
    <div class="jc-attendance-info data-statistics-border jc-flex-con-4"></div>

    <!-- AI 智能分析 -->
    <div class="jc-intelligent-analysis data-statistics-border jc-flex-con-3"></div>
  </div>
</template>

<script>
// 导入组件

export default {
  name: 'ScreenDataStatisticsOtherInfo'
}
</script>

<style lang="scss" scoped>
.jc-attendance-info {
  margin: 20px 0;
}
</style>
