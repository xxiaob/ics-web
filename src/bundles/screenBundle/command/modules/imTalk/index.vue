<template>
  <div class="jc-screen-message">这里是聊天区域</div>
</template>
<script>
export default {
  name: 'ScreenCommandImTalk',
  props: ['options'],
  data() {
    return {
      visible: true
    }
  },
  created() {
    console.log('ScreenCommandImTalk')
  },
  methods: {

  },
  activated() {
    //设置该窗口显示
    this.visible = true
    console.log('ScreenCommandImTalk activated')
  },
  deactivated() {
    //设置该窗口隐藏,然后开始新消息数量通知
    this.visible = false
    console.log('ScreenCommandImTalk deactivated')
  }
}
</script>
