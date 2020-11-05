<template>
  <view-warp :title="title">
    <keep-alive>
      <component :is="types[(options.systemSourceType?options.systemSourceType:'') + options.type]" :info="options" :projectId="project.projectId"></component>
    </keep-alive>
    <!-- {id:'80964647959658496'} -->
  </view-warp>
</template>
<script>
import { MESSAGE_TYPE, SYSTEM_MESSAGE_TYPE } from '@/constant/Dictionaries'
export default {
  name: 'ScreenCommandMessageDetail',
  props: ['options', 'project'],
  components: {
    ViewWarp: () => import('../common/viewWarp'),
    DetailEvent: () => import('./modules/event'),
    DetailTask: () => import('./modules/task'),
    DetailQuestion: () => import('./modules/question'),
    DetailTemporary: () => import('./modules/temporary'),

    DetailDregsQuestion: () => import('./modules/dregsQuestion'),
    DetailDregsAlarm: () => import('./modules/warning')
  },
  data() {
    return {
      types: {
        [MESSAGE_TYPE.EVENT]: 'DetailEvent',
        [MESSAGE_TYPE.QUESTION]: 'DetailQuestion',
        [MESSAGE_TYPE.TASK]: 'DetailTask',
        [MESSAGE_TYPE.TEMPORARY]: 'DetailTemporary',

        [SYSTEM_MESSAGE_TYPE.SELF + MESSAGE_TYPE.EVENT]: 'DetailEvent',
        [SYSTEM_MESSAGE_TYPE.SELF + MESSAGE_TYPE.QUESTION]: 'DetailQuestion',
        [SYSTEM_MESSAGE_TYPE.SELF + MESSAGE_TYPE.TASK]: 'DetailTask',
        [SYSTEM_MESSAGE_TYPE.SELF + MESSAGE_TYPE.TEMPORARY]: 'DetailTemporary',
        //渣土系统 - 事件 问题 告警   本系统事件和溧水渣土事件共用  内部通过SYSTEM_MESSAGE_TYPE区分
        [SYSTEM_MESSAGE_TYPE.DREGS + MESSAGE_TYPE.EVENT]: 'DetailEvent',
        [SYSTEM_MESSAGE_TYPE.DREGS + MESSAGE_TYPE.QUESTION]: 'DetailDregsQuestion',
        [SYSTEM_MESSAGE_TYPE.DREGS + MESSAGE_TYPE.ALARM]: 'DetailDregsAlarm'

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
