<template>
  <div class="jc-screen-opreate">
    <div class="jc-opreate-item">
      <i class="jc-select"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-show-area"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-show-word"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-temporary-tasks"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-together"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-map-switch"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-message"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-talk"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ScreenCommandOperate',
  data() {
    return {

    }
  },
  methods: {
    messageChange(name) {
      this.$EventBus.$emit('message-component-change', { component: name, options: null }) //通知窗口改变
    }
  }
}
</script>
