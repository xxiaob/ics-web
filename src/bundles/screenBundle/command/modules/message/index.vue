<template>
  <div class="jc-screen-message">
    <transition-group name="jc-list" tag="div" class="jc-message-content">
      <div class="jc-message-item" v-for="item in list" :key="item.id" @click="detail(item)">
        <div class="jc-message-title" :class="style[item.type]">今天那里特别堵，我今天也在路边等了</div>
        <div class="jc-message-user">杨超{{index}}</div>
      </div>
    </transition-group>
  </div>
</template>
<script>
export default {
  name: 'ScreenCommandMessage',
  props: ['options'],
  data() {
    return {
      visible: true,
      index: 1,
      maxLength: 20, //最大数量
      list: [],
      style: { 0: 'jc-event', 1: 'jc-question', 2: 'jc-task' },
      interval: null
    }
  },
  mounted() {
    this.initData()
    this.interval = setInterval(() => {
      this.list.splice(0, 0, { id: this.index++, type: this.index % 3 })
      if (this.list.length > this.maxLength) {
        this.list.splice(this.maxLength, this.list.length - this.maxLength)
      }
    }, 1000 * 10)
  },
  methods: {
    initData() {

    },
    detail(item) {
      this.$EventBus.$emit('view-component-change', { component: 'MessageDetail', options: item }) //通知窗口改变
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
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>
