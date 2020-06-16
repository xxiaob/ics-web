<template>
  <view-warp :title="title">
    <detail-event :info="{id:'60313843976372224'}" v-if="options.type == 0"></detail-event>
    <detail-question :options="options" v-else-if="options.type == 1"></detail-question>
    <detail-task :options="options" v-else-if="options.type == 2"></detail-task>
  </view-warp>
</template>
<script>
export default {
  name: 'ScreenCommandMessageDetail',
  props: ['options'],
  components: {
    ViewWarp: () => import('../common/viewWarp'),
    DetailEvent: () => import('./modules/event'),
    DetailTask: () => import('./modules/task'),
    DetailQuestion: () => import('./modules/question')
  },
  computed: {
    title() {
      let types = { 0: '事件详情', 1: '问题详情', 2: '任务详情' }

      return types[this.options.type]
    }
  }
}
</script>
