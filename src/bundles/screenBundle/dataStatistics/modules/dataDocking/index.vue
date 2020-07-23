<template>
  <div class="jc-screen-data-docking jc-flex-warp jc-flex-vertical">
    <jc-case-summary class="jc-flex-con-3"></jc-case-summary>

    <jc-urban-management class="dock-comp jc-flex-con-2"></jc-urban-management>
    <jc-build-illegal class="dock-comp jc-flex-con-2"></jc-build-illegal>
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
  border: 1px solid rgb(32, 73, 154);
  box-shadow: inset 0 0 10px 0 rgb(32, 73, 154);

  .dock-comp {
    border-top: 1px solid rgb(32, 73, 154);
    padding: 0 $jc-default-dis $jc-default-dis/2;
  }
}
</style>

