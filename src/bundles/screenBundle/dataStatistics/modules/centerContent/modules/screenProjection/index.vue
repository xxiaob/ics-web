<template>
  <transition name="bounce">
    <div class="jc-screen-space" v-show="show">
      <jc-live v-show="showModule===1"></jc-live>
      <jc-event v-show="showModule===2"></jc-event>
      <jc-question v-show="showModule===3"></jc-question>
      <jc-task v-show="showModule===4"></jc-task>
    </div>
  </transition>

</template>

<script>
import JcLive from './modules/live'
import JcEvent from './modules/event'
import JcQuestion from './modules/question'
import JcTask from './modules/task'
export default {
  name: 'ScreenDataCenterContentScreenProjection',
  components: { JcLive, JcEvent, JcQuestion, JcTask },
  data() {
    return {
      show: false,
      showModule: 1
    }
  },
  created() {
    setTimeout(()=>{
      this.show = true
    }, 2000)
    // setTimeout(()=>{
    //   this.show = false
    // }, 4000)
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
