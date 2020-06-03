<template>
  <div class="jc-screen-opreate no-select">
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
      <i class="jc-message" @click="messageChange('CommandMessage')"></i>
      <span class="jc-num-tip" v-if="messageVal > 0" v-text="messageVal < 100 ? messageVal : '99'"></span>
    </div>
    <!-- <div class="jc-opreate-item">
      <i class="jc-talk" @click="messageChange('ImTalk')"></i>
      <span class="jc-num-tip" v-if="talkVal > 0" v-text="talkVal < 100 ? talkVal : '99'"></span>
    </div> -->
  </div>
</template>
<script>
export default {
  name: 'ScreenCommandOperate',
  data() {
    return {
      messageVal: 99,
      talkVal: 99
    }
  },
  created() {

  },
  methods: {
    messageChange(name) {
      this.$EventBus.$emit('message-component-change', { component: name, options: null }) //通知窗口改变
    }
  }
}
</script>
