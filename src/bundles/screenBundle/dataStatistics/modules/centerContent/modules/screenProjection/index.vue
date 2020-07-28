<template>
  <transition name="bounce">
    <div class="jc-screen-space" v-show="show">
      <jc-live v-show="showModule===MESSAGE_DATA_TYPES.LIVE" :options="options"></jc-live>
      <jc-event v-show="showModule===2" :options="{id:'71279185972166656'}"></jc-event>
      <jc-question v-show="showModule===3" :options="{id:'73488564293206016'}"></jc-question>
      <jc-temporary-task v-show="showModule===4" :options="{id:'71636607261736960'}"></jc-temporary-task>
      <jc-daily-task v-show="showModule===5" :options="{id:'70910841347637248'}"></jc-daily-task>
    </div>
  </transition>

</template>

<script>
import JcLive from './modules/live'
import JcEvent from './modules/event'
import JcQuestion from './modules/question'
import JcTemporaryTask from './modules/temporaryTask'
import JcDailyTask from './modules/dailyTask'
import { MESSAGE_DATA_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'ScreenDataCenterContentScreenProjection',
  components: { JcLive, JcEvent, JcQuestion, JcDailyTask, JcTemporaryTask },
  data() {
    return {
      MESSAGE_DATA_TYPES,
      show: false,
      showModule: 1,
      options: {}
    }
  },
  created() {
    // setTimeout(()=>{
    //   this.show = true
    // }, 0)
    // setTimeout(()=>{
    //   this.show = false
    // }, 4000)
    this.$EventBus.$on('data-statistics-screen-projection', data=>{
      console.log('投屏消息', data)
      if (data.type === MESSAGE_DATA_TYPES.CLOSR) {
        this.show = false
        this.showModule = null
        this.options = null
      } else {
        this.show = true
        this.showModule = data.type
        this.options = data.data
      }
    })
  },
  methods: {
    test() {
      this.show = false
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
  animation: bounce-in 0.5s reverse;
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
</style>
