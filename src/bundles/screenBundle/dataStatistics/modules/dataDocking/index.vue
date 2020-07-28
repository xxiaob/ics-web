<template>
  <div class="jc-screen-data-docking data-statistics-border jc-flex-warp jc-flex-vertical">
    <!-- 案件概要 -->
    <jc-case-summary class="jc-flex-con-3"></jc-case-summary>

    <!-- 数字城管 -->
    <jc-urban-management class="dock-comp jc-flex-con-2"></jc-urban-management>

    <!-- 建筑违建 -->
    <jc-build-illegal class="dock-comp jc-flex-con-2"></jc-build-illegal>

    <!-- 智慧环卫 -->
    <jc-wisdom-sanitation class="dock-comp jc-flex-con-2"></jc-wisdom-sanitation>

  </div>
</template>
<script>
// 导入组件
import JcCaseSummary from './modules/caseSummary'
import JcUrbanManagement from './modules/urbanManagement'
import JcBuildIllegal from './modules/buildIllegal'
import JcWisdomSanitation from './modules/wisdomSanitation'


export default {
  name: 'ScreenDataStatisticsDataDocking',
  components: {
    JcCaseSummary,
    JcUrbanManagement,
    JcBuildIllegal,
    JcWisdomSanitation

  }
}
</script>
<style lang="scss" scoped>
.jc-screen-data-docking {
  overflow: hidden;
  .dock-comp {
    border-top: 1px solid rgb(32, 73, 154);
  }
}
</style>

