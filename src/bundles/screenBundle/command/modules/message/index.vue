<template>
  <div class="jc-screen-message">
    <transition-group name="jc-list" tag="div" class="jc-message-content">
      <div class="jc-message-item" v-for="(item,index) in list" :key="item.id" @click="manage(index,item)">
        <div class="jc-message-title jc-event">今天那里特别堵，我今天也在路边等了</div>
        <div class="jc-message-user">杨超</div>
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
      list: []
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {

    },
    manage(index, item) {
      //点击详情处理
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
