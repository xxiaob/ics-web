<template>
  <transition name="bounce">
    <div class="jc-screen-space" v-show="show">
      <div class="jc-close" @click="close">投屏关闭</div>
      <jc-live v-show="showModule===MESSAGE_DATA_TYPES.LIVE" :options="options"></jc-live>
      <jc-event v-show="showModule===MESSAGE_DATA_TYPES.EVENT" :options="options"></jc-event>
      <jc-question v-show="showModule===MESSAGE_DATA_TYPES.QUESTION&&SYSTEM_MESSAGE_TYPE.SELF==options.systemSourceType" :options="options"></jc-question>
      <jc-temporary-task v-show="showModule===MESSAGE_DATA_TYPES.TEMPORARY" :options="options"></jc-temporary-task>
      <jc-daily-task v-show="showModule===MESSAGE_DATA_TYPES.TASK" :options="options"></jc-daily-task>

      <jc-dregs-question v-show="showModule===MESSAGE_DATA_TYPES.QUESTION&&SYSTEM_MESSAGE_TYPE.DREGS==options.systemSourceType" :options="options"></jc-dregs-question>
      <jc-dregs-warning v-show="showModule===MESSAGE_DATA_TYPES.ALARM&&SYSTEM_MESSAGE_TYPE.DREGS==options.systemSourceType" :options="options"></jc-dregs-warning>
    </div>
  </transition>

</template>

<script>
import JcLive from './modules/live'

import JcEvent from './modules/event' //本系统事件和溧水渣土事件共用 内部通过SYSTEM_MESSAGE_TYPE区分
import JcQuestion from './modules/question'
import JcTemporaryTask from './modules/temporaryTask'
import JcDailyTask from './modules/dailyTask'

//溧水渣土系统相关
import JcDregsQuestion from './modules/dregsQuestion'
import JcDregsWarning from './modules/warning'

import { MESSAGE_DATA_TYPES, SYSTEM_MESSAGE_TYPE } from '@/constant/Dictionaries'

export default {
  name: 'ScreenDataCenterContentScreenProjection',
  components: { JcLive, JcEvent, JcQuestion, JcDailyTask, JcTemporaryTask, JcDregsQuestion, JcDregsWarning },
  data() {
    return {
      MESSAGE_DATA_TYPES,
      SYSTEM_MESSAGE_TYPE,
      show: false,
      showModule: null,
      options: {}
    }
  },
  created() {
    this.$EventBus.$on('data-statistics-screen-projection', data=>{
      console.log('投屏消息', data)
      if (data.type === MESSAGE_DATA_TYPES.CLOSR) {
        if (data.closeType === this.showModule) {
          this.show = false
          this.showModule = null
          this.options = {}
        } else {
          console.log('关闭投屏类型', data.closeType)
        }
      } else {
        this.show = true
        this.showModule = data.type
        this.options = data.data
        this.options.type = data.type
      }
    })
  },
  methods: {
    close() {
      this.show = false
      this.showModule = null
      this.options = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-screen-space {
  position: absolute;
  padding: $jc-default-dis * 2;
  background: url(./assets/screen-bg.png) no-repeat center;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;

  .jc-close {
    position: absolute;
    right: 50px;
    bottom: -50px;
    cursor: pointer;
    color: white;
    background: #033c93;
    width: 100px;
    height: 36px;
    line-height: 36px;
    text-align: center;
  }
}

.jc-screen-warp {
  width: 100%;
  height: 100%;
}

//入场 出场动画
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-out 0.5s;
}

@keyframes bounce-in {
  from,
  20%,
  40%,
  60%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }

  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes bounce-out {
  20% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  50%,
  55% {
    opacity: 1;
    transform: scale3d(1.1, 1.1, 1.1);
  }

  to {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
}
</style>
