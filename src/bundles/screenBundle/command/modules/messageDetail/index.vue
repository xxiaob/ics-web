<template>
  <view-warp :title="title">
    <keep-alive>
      <component :is="types[options.systemSourceType+options.type]" :info="options"></component>
    </keep-alive>
    <!-- {id:'80964647959658496'} -->
  </view-warp>
</template>
<script>
import { MESSAGE_TYPE, SYSTEM_MESSAGE_TYPE } from '@/constant/Dictionaries'
export default {
  name: 'ScreenCommandMessageDetail',
  props: ['options'],
  components: {
    ViewWarp: () => import('../common/viewWarp'),
    DetailEvent: () => import('./modules/event'),
    DetailTask: () => import('./modules/task'),
    DetailQuestion: () => import('./modules/question'),
    DetailDregsQuestion: () => import('./modules/dregsQuestion'),
    DetailTemporary: () => import('./modules/temporary')
  },
  data() {
    return {
      types: {
        [SYSTEM_MESSAGE_TYPE.SELF + MESSAGE_TYPE.EVENT]: 'DetailEvent',
        [SYSTEM_MESSAGE_TYPE.SELF + MESSAGE_TYPE.QUESTION]: 'DetailQuestion',
        [SYSTEM_MESSAGE_TYPE.SELF + MESSAGE_TYPE.TASK]: 'DetailTask',
        [SYSTEM_MESSAGE_TYPE.SELF + MESSAGE_TYPE.TEMPORARY]: 'DetailTemporary',
        [SYSTEM_MESSAGE_TYPE.DREGS + MESSAGE_TYPE.DREGSQUESTION]: 'DetailDregsQuestion'
        //渣土事件 告警
      }
    }
  },
  computed: {
    title() {
      return MESSAGE_TYPE.toString(this.options.type) + '详情'
    }
  }
}
</script>
