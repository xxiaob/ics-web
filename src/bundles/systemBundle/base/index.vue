<template>
  <div class="jc-main-container-warp">
    <el-tabs v-model="tabComponent">
      <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.value" :key="tab.value"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="tabComponent" :user="user"></component>
    </keep-alive>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'SystemBaseIndex',
  components: {
    IncorruptGovernment: () => import('./modules/incorruptGovernment'),
    LogoConfigure: () => import('./modules/logoConfigure'),
    EntryRoute: () => import('./modules/entryRoute'),
    BusinessSystem: () => import('./modules/businessSystem')
  },
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      tabComponent: 'IncorruptGovernment',
      tabs: [
        { label: '廉政提醒', value: 'IncorruptGovernment' },
        { label: 'logo配置', value: 'LogoConfigure' },
        { label: '入口路由', value: 'EntryRoute' },
        { label: '业务系统', value: 'BusinessSystem' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
