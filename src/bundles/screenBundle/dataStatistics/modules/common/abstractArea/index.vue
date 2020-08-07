<template>
  <div class="jc-abstract-area jc-flex-warp jc-flex-vertical jc-flex-con">
    <div class="jc-title-wrap">
      <div class="jc-title">
        <span class="jc-title-content">{{ title }}</span>

        <slot name="title"></slot>
      </div>
    </div>
    <div class="jc-flex-con jc-flex-warp">
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
.jc-title-wrap {
  padding: 0 16px;
}
</style>
