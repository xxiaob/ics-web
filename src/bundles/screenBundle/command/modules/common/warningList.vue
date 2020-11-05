<template>
  <div class="jc-warning-list" v-if="list&&list.length">
    <el-menu
      :default-openeds="[list[0].id]"
      background-color="#fff"
      text-color="#E43939"
      active-text-color="#E43939">
      <el-submenu v-for="item in list" :index="item.id" :key="item.id">
        <template slot="title">
          <span class="jc-title">告警：{{formatType(item.alarmSource)}}</span>
          <img class="jc-right" src="./assets/remind.png" alt="" @click.stop="remind" title="提醒相关人员">
        </template>
        <div class="jc-detail">
          <p>组织：{{item.orgName}}</p>
          <p>时间：{{formatTime(item.alarmTime)}}</p>
          <p>地点：{{item.alarmLocation}}</p>
          <p>描述：{{item.alarmDesc}}</p>
          <p>状态：{{formatStatus(item.enabled)}}</p>
        </div>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { WARNING_TYPE, SYSTEM_ALARM_STATUS } from '@/constant/Dictionaries'
import { formatDate } from '@/libs/util'

export default {
  name: 'ScreenCommandWarningList',
  props: {
    list: {
      type: Array,
      default: ()=>[]
    }
  },
  methods: {
    formatStatus(status) {
      return SYSTEM_ALARM_STATUS.toString(status)
    },
    formatTime(time) {
      return formatDate(time)
    },
    formatType(type) {
      return WARNING_TYPE.toString(type + '')
    },
    remind() {
      console.log('remind')
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-warning-list{
  padding: $jc-default-dis/2;
}
.el-menu /deep/{
  border: none;
  .el-submenu{
    margin-bottom: $jc-default-dis/2;
  }
  .el-submenu__title{
    background: #FFF2F1!important;
    padding: 0 $jc-default-dis/2!important;
    height: 34px;
    line-height: 34px;
    &:hover{
      background: #FFF2F1!important;
    }
    i{
      color: inherit;
    }
    .jc-title{
      display: inline-block;
      width: 78%;
      @include jc-text-warp;
    }
    .jc-right{
      float: right;
      margin-right: $jc-default-dis*2;
      margin-top: 11px;
    }
  }

  .jc-detail{
    padding: $jc-default-dis/2;
    background: #FAFAFA;
    font-size: 12px;
    color: #999999;
    line-height: 22px;
  }
}
</style>
