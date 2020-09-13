<template>
  <view-warp :title="title">
    <keep-alive>
      <component :is="types[options.type]" :info="options"></component>
    </keep-alive>
    <!-- {id:'80964647959658496'} -->
  </view-warp>
</template>
<script>
import { MESSAGE_TYPE } from '@/constant/Dictionaries'
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
        [MESSAGE_TYPE.EVENT]: 'DetailEvent',
        [MESSAGE_TYPE.QUESTION]: 'DetailQuestion',
        [MESSAGE_TYPE.TASK]: 'DetailTask',
        [MESSAGE_TYPE.TEMPORARY]: 'DetailTemporary',
        [MESSAGE_TYPE.DREGSQUESTION]: 'DetailDregsQuestion'
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
