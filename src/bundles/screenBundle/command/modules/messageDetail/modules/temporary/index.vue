<template>
  <div class="jc-temporary">
    <view-tabs v-model="tabComponent" :options="tabs"></view-tabs>
    <keep-alive>
      <component :is="tabComponent" :taskId="info.id" :projectId="projectId"></component>
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: 'ScreenCommandMessageDetailTemporary',
  props: ['info', 'projectId'],
  components: {
    ViewTabs: () => import('../../../common/viewTabs'),
    BaseInfo: () => import('./modules/baseInfo'),
    ForwardList: () => import('./modules/forwardList'),
    EventList: () => import('./modules/eventList')
  },
  data() {
    return {
      tabComponent: 'BaseInfo',
      tabs: [
        { label: '基础信息', value: 'BaseInfo' },
        { label: '流转记录', value: 'ForwardList' },
        { label: '关联事件', value: 'EventList' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-temporary {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
