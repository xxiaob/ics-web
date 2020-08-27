<template>
  <div class="jc-main-container-warp">
    <el-tabs v-model="tabComponent">
      <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.value" :key="tab.value"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="tabComponent" :user="authorityOrg"></component>
    </keep-alive>
  </div>
</template>

<script>
import { getPOrgIdWithSameLevelAuth } from '@/api/organization'

export default {
  name: 'SystemBaseIndex',
  components: {
    IncorruptGovernment: () => import('./modules/incorruptGovernment'),
    LogoConfigure: () => import('./modules/logoConfigure'),
    ScreenConfigure: () => import('./modules/screenConfigure'),
    EntryRoute: () => import('./modules/entryRoute'),
    BusinessSystem: () => import('./modules/businessSystem')
  },
  data() {
    return {
      authorityOrg: {},
      tabComponent: 'IncorruptGovernment',
      tabs: [
        { label: '廉政提醒', value: 'IncorruptGovernment' },
        { label: 'logo配置', value: 'LogoConfigure' },
        { label: '大屏配置', value: 'ScreenConfigure' },
        { label: '入口路由', value: 'EntryRoute' },
        { label: '业务系统', value: 'BusinessSystem' }
      ]
    }
  },
  async created() {
    this.authorityOrg = await getPOrgIdWithSameLevelAuth()
  }
}
</script>

<style lang="scss" scoped>
.el-tabs /deep/ {
  .el-tabs__header {
    background: white;
    .el-tabs__item.is-top {
      padding-left: 20px;
    }
  }
}
</style>
