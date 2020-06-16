<template>
  <view-warp :title="title">
    <detail-event :info="{id:'60313843976372224'}" v-if="options.type == MESSAGE_TYPE.EVENT"></detail-event>
    <detail-question :info="{id:'57905680299851776'}" v-else-if="options.type == MESSAGE_TYPE.QUESTION"></detail-question>
    <detail-task :info="{id:'60757469189636096'}" v-else-if="options.type == MESSAGE_TYPE.TASK"></detail-task>
    <detail-temporary :info="options" v-else-if="options.type == MESSAGE_TYPE.TEMPORARY"></detail-temporary>
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
    DetailTemporary: () => import('./modules/temporary')
  },
  data() {
    return {
      MESSAGE_TYPE
    }
  },
  computed: {
    title() {
      return MESSAGE_TYPE.toString(this.options.type)
    }
  }
}
</script>
