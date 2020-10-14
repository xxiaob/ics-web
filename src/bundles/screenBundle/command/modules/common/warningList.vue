<template>
  <div class="jc-warning-list" v-if="list&&list.length">
    <el-menu
      :default-active="list[0]"
      background-color="#fff"
      text-color="#E43939"
      active-text-color="#E43939">
      <el-submenu v-for="item in list" :index="item" :key="item">
        <template slot="title">
          <span class="jc-title">告警：岗点日常-未准点到达</span>
          <img class="jc-right" src="./assets/remind.png" alt="" @click.stop="remind" title="提醒相关人员">
        </template>
        <div class="jc-detail">
          <p>组织：南京城管总队</p>
          <p>时间：2020-09-09 10:08:04</p>
          <p>地点：南京市鼓楼区湖南路街道北京西路1-1号</p>
          <p>描述：周世林脱离考勤区</p>
          <p>状态：关闭</p>
        </div>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'ScreenCommandWarningList',
  data() {
    return {
      list: []
      // list: ['1', '2', '3', '4']
    }
  },
  methods: {
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
