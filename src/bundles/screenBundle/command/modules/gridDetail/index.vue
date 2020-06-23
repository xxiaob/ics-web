<template>
  <view-warp :title="options.areaName">
    <div class="jc-view-content"></div>
  </view-warp>
</template>
<script>
export default {
  name: 'ScreenCommandGridDetail',
  props: ['options', 'project'],
  components: {
    ViewWarp: () => import('../common/viewWarp')
  }
}
</script>
