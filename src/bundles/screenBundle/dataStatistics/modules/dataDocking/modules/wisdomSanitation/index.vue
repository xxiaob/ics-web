<template>
    <!--  智慧环卫  -->
    <abstract-area 
      title="智慧环卫"
    >
      <div class="jc-urban-management jc-flex-warp">
        <div class="jc-manage-item jc-flex-warp">
          <span class="jc-manage-title">工单上报</span>
          <span class="jc-manage-count">
            <count-to :startVal="0" :endVal="2384" :duration="3000" separator=""/>件
          </span>
        </div>
        <div class="jc-manage-item jc-flex-warp">
          <span class="jc-manage-title">工单处理</span>
          <span class="jc-manage-count">
            <count-to :startVal="0" :endVal="2384" :duration="3000" separator=""/>件
          </span>
        </div>
        <div class="jc-manage-item jc-flex-warp">
          <span class="jc-manage-title">结案比率</span>
          <span class="jc-manage-count">
            <count-to :startVal="0" :endVal="2384" :duration="3000" separator=""/>件
          </span>
        </div>
        <div class="jc-manage-item jc-flex-warp">
          <span class="jc-manage-title">在线网格员</span>
          <span class="jc-manage-count">
            <count-to :startVal="0" :endVal="2384" :duration="3000" separator=""/>件
          </span>
        </div>

      </div>

    </abstract-area>
</template>
<script>
// 导入组件
import abstractArea from "../../../../command/abstractArea"

import countTo from 'vue-count-to';

export default {
  name: 'ScreenDataStatisticsWisdomSanitation',
  components:{
    abstractArea,
    countTo
  }
}
</script>
<style lang="scss" scoped>

    .jc-urban-management {
        flex-wrap: wrap;
        justify-content: space-between;
        height:100%;


        .jc-manage-item{
          justify-content: center;
          align-items: center;
          width: 50%;
          height:50%;
          background: url("../../../../assets/citysummary.png") no-repeat center/100%;
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

</style>