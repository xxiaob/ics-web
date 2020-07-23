<template>
  <div class="jc-abstract-area jc-flex-warp jc-flex-vertical">
    <div class="jc-title">
      <span class="jc-title-content">{{ title }}</span>

      <slot name="title"></slot>
    </div>
    <div class="jc-flex-con">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScreenDataStatisticsDataDockingDockBase',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
