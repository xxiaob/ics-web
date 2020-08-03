<template>
  <div class="jc-other-info jc-flex-warp jc-flex-vertical">
    <!-- 气象信息 -->
    <jc-weather-info class="jc-weather-info data-statistics-border"></jc-weather-info>

    <!-- 出勤信息 -->
    <jc-attendance-info class=" data-statistics-border jc-attendance-info jc-flex-con-4"></jc-attendance-info>

    <!-- AI 智能分析 -->
    <jc-smart-analy class="jc-intelligent-analysis data-statistics-border jc-flex-con-3"></jc-smart-analy>
  </div>
</template>

<script>
// 导入组件
import JcWeatherInfo from './modules/weatherInfo' // 天气信息
import JcAttendanceInfo from './modules/attendanceInfo' // 出勤
import JcSmartAnaly from './modules/smartAnaly' // 智能分析

export default {
  name: 'ScreenDataStatisticsOtherInfo',
  components: { JcWeatherInfo, JcAttendanceInfo, JcSmartAnaly }
}
</script>

<style lang="scss" scoped>
.jc-attendance-info {
  margin: 20px 0;
}
</style>
