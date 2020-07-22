<template>
  <div class="jc-screen-message">
    <transition-group name="jc-list" tag="div" class="jc-message-content">
      <div class="jc-message-item" v-for="item in list" :key="item.id" @click="detail(item)">
        <div class="jc-message-title" :class="style[item.type]">{{item.title}}</div>
        <div class="jc-message-user">{{item.userName}}</div>
      </div>
    </transition-group>
  </div>
</template>
<script>
import { MESSAGE_TYPE } from '@/constant/Dictionaries'

export default {
  name: 'ScreenCommandMessage',
  props: ['options', 'project'],
  data() {
    return {
      visible: true,
      notReadNum: 0,
      maxLength: 20, //最大数量
      list: [],
      index: 0,
      style: { [MESSAGE_TYPE.EVENT]: 'jc-event', [MESSAGE_TYPE.QUESTION]: 'jc-question', [MESSAGE_TYPE.TASK]: 'jc-task', [MESSAGE_TYPE.TEMPORARY]: 'jc-task' }
    }
  },
  created() {
    this.$EventBus.$on('screen-message-init', this.messageInit) //监听消息 初始化
    this.$EventBus.$on('screen-message-change', this.initData) //监听消息
    // this.interval = setInterval(() => {
    //   this.list.splice(0, 0, { id: this.index++, type: '3', title: '测试' })
    //   if (this.list.length > this.maxLength) {
    //     this.list.splice(this.maxLength, this.list.length - this.maxLength)
    //   }
    // }, 1000 * 3)
  },
  mounted() {
    this.$nextTick(() => {
      this.$EventBus.$emit('message-component-change', { component: 'CommandMessage', options: null }) //通知窗口改变
    })
  },
  methods: {
    initData(data) {
      let message = data.messageDTO

      /**
       * 如果当前窗口隐藏，接收到的消息是事件则通知未读数据变化，如果是其他则弹出显示
       */
      if (!this.visible) {
        if (message.messageType == MESSAGE_TYPE.EVENT) {
          this.notReadNum++
          this.$EventBus.$emit('message-num-change', { type: 1, num: this.notReadNum }) //通知事件变更
        } else {
          this.$EventBus.$emit('message-num-change', { type: 2 }) //通知事件变更
        }
      }

      this.list.splice(0, 0, { id: message.businessKey, type: message.messageType + '', title: message.titleName, userName: message.userName })
      //处理列表只显示最大数量的事件问题
      if (this.list.length > this.maxLength) {
        this.list.splice(this.maxLength, this.list.length - this.maxLength)
      }

      this.$EventBus.$emit('map-voice-alert', { type: message.messageType + '' }) //通知播放提示音
    },
    messageInit(data) {
      console.log('screen-message-init', data)
      if (data && data.length) {
        let list = []

        data.forEach(item => {
          list.push( { id: item.businessKey, type: MESSAGE_TYPE.TEMPORARY, title: item.taskName, userName: item.startUser })
        })
        this.list = list
      }
    },
    detail(item) {
      this.$EventBus.$emit('view-component-change', { component: 'MessageDetail', options: item }) //通知窗口改变
    }
  },
  activated() {
    //设置该窗口显示
    this.notReadNum = 0
    this.visible = true
    console.log('ScreenCommandMessage activated')
  },
  deactivated() {
    //设置该窗口隐藏,然后开始新消息数量通知
    this.visible = false
    console.log('ScreenCommandMessage deactivated')
  },
  beforeDestroy() {
    //去除监听
    this.$EventBus.$off('screen-message-change', this.initData)
    this.$EventBus.$off('screen-message-init', this.messageInit)
  }
}
</script>
