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
import JcCaseSummary from "./modules/caseSummary"

import JcUrbanManagement from "./modules/urbanManagement"
import JcBuildIllegal from "./modules/buildIllegal"
import JcWisdomSanitation from "./modules/wisdomSanitation"




export default {
  name: 'ScreenDataStatisticsDataDocking',
  components:{
    JcCaseSummary,
    JcUrbanManagement,
    JcBuildIllegal,
    JcWisdomSanitation,
    
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


      .jc-city-management {
        flex-wrap: wrap;
        justify-content: space-between;
        height:100%;


        .jc-manage-item{
          justify-content: center;
          align-items: center;
          width: 50%;
          height:50%;
          background: url("../../assets/citysummary.png") no-repeat center/100%;
          background-origin:content-box;

          &:nth-child(odd){
            padding-right:16px;
          }
          &:nth-child(even){
            padding-left:16px;
          }
          
          span {
            padding-bottom:24px;
          }
          .jc-manage-title {
            font-size: 14px;
            letter-spacing: 1px;
            color: #11e7ff;
            margin-right:20px;
          }

          .jc-manage-count {
            font-size: 18px;
            letter-spacing: 1px;
            color: #ffffff;
          }
        
        }
      }
    }
  }
</style>
 