<template>
  <div class="jc-screen-message">wewww</div>
</template>
<script>
export default {
  name: 'ScreenCommandMessage',
  props: ['options'],
  data() {
    return {
      visible: true
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {

    }
  },
  activated() {
    //设置该窗口显示
    this.visible = true
    console.log('ScreenCommandMessage activated')
  },
  deactivated() {
    //设置该窗口隐藏,然后开始新消息数量通知
    this.visible = false
    console.log('ScreenCommandMessage deactivated')
  }
}
</script>
