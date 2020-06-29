<template>
  <view-warp :title="options.userName">
    <view-tabs v-model="tabComponent" :options="tabs"></view-tabs>
    <keep-alive>
      <component :is="tabComponent" :options="options" :project="project"></component>
    </keep-alive>
  </view-warp>
</template>
<script>
export default {
  name: 'ScreenCommandUserDetail',
  props: ['options', 'project'],
  components: {
    ViewWarp: () => import('../common/viewWarp'),
    ViewTabs: () => import('../common/viewTabs'),
    BaseInfo: () => import('./modules/baseInfo'), //基础信息
    UserTask: () => import('./modules/task'), //任务 问题 事件
    WorkCheck: () =>import('./modules/workCheck') //考勤
  },
  data() {
    return {
      tabComponent: 'BaseInfo',
      tabs: [{ label: '基础信息', value: 'BaseInfo' }, { label: '综合', value: 'UserTask' }, { label: '考勤', value: 'WorkCheck' }]
    }
  }
}
</script>
