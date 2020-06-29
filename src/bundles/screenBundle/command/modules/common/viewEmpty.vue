<template>
  <div class="jc-view-empty">暂无数据</div>
</template>
<script>
export default {
  name: 'ScreenCommandViewEmpty',
  props: {
    tip: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-view-empty {
  width: 100%;
  background: url(./assets/empty.png) no-repeat 30px center;
  background-size: auto 210px;
  padding-top: 240px;
  color: $jc-color-text-secondary;
  line-height: 30px;
  text-align: center;
}
</style>
