<template>
  <view-warp :title="options.areaName">
    <view-tabs v-model="tabComponent" :options="tabs"></view-tabs>
    <keep-alive>
      <component :is="tabComponent" :options="options" :project="project"></component>
    </keep-alive>
  </view-warp>
</template>
<script>
export default {
  name: 'ScreenCommandGridDetail',
  props: ['options', 'project'],
  components: {
    ViewWarp: () => import('../common/viewWarp'),
    ViewTabs: () => import('../common/viewTabs'),
    BaseInfo: () => import('./modules/baseInfo'), //基础信息
    GridTask: () => import('./modules/task'), //任务 问题 事件
    WorkCheck: () =>import('./modules/workCheck'), //考勤
    GridResources: ()=> import('./modules/resources') //岗点资源，目前显示一键采集的内容
  },
  data() {
    return {
      tabComponent: 'BaseInfo',
      tabs: [{ label: '基础信息', value: 'BaseInfo' }, { label: '综合', value: 'GridTask' }, { label: '考勤', value: 'WorkCheck' }, { label: '一键采集', value: 'GridResources' }]
    }
  }
}
</script>
