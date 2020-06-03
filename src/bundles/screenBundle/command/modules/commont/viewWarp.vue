<template>
  <div class="jc-view-warp">
    <div class="jc-view-header">{{title}}<i class="iconfont iconchehui1" @click="viewBack"></i></div>
  </div>
</template>
<script>
export default {
  name: 'ScreenCommandViewWarp',
  props: {
    title: {
      type: String,
      default: '这里是view标题'
    }
  },
  methods: {
    viewBack() {
      this.$EventBus.$emit('view-component-back') //通知view 返回
    }
  }
}
</script>
