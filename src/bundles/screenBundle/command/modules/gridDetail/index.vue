<template>
  <view-warp :title="options.areaName">
    <view-tabs v-model="tabActive" :options="tabs"></view-tabs>
    <div class="jc-view-content"></div>
  </view-warp>
</template>
<script>
export default {
  name: 'ScreenCommandGridDetail',
  props: ['options', 'project'],
  components: {
    ViewWarp: () => import('../common/viewWarp'),
    ViewTabs: () => import('../common/viewTabs')
  },
  data() {
    return {
      tabActive: '',
      tabs: [{ label: '基础信息', value: '1' }, { label: '任务', value: '2' }, { label: '考勤', value: '3' }]
    }
  }
}
</script>
