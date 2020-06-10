<template>
  <view-warp :title="title">

  </view-warp>
</template>
<script>
export default {
  name: 'ScreenCommandMessageDetail',
  props: ['options'],
  components: {
    ViewWarp: () => import('../common/viewWarp'),
    DetailEvent: () => import('./modules/event'),
    DetailTask: () => import('./modules/event'),
    DetailQuestion: () => import('./modules/event')
  },
  computed: {
    title() {
      let types = { 0: '事件详情', 1: '问题详情', 2: '任务详情' }

      return types[this.options.type]
    }
  },
  activated() {
    console.log('ScreenCommandMessageDetail activated')
  }
}
</script>
