<template>
  <div class="jc-flex-con jc-flex-warp jc-flex-vertical jc-event">
    <div class="jc-title">
      <span class="jc-title-content">实时事件</span>
      <div class="jc-right-box">
        <span class="jc-right-item">7月8日</span>
        <span class="jc-right-item">江苏省 南京市 溧水区</span>
      </div>
    </div>
    <div class="jc-flex-con jc-event-list">
      <transition-group name="jc-list" tag="div">
        <div class="jc-list-item jc-flex-warp" v-for="item in list" :key="item">
          <div class="img">
            <img src="./assets/none.png" alt="" width="100%" height="100%">
          </div>
          <div class="jc-flex-con jc-list-item-content jc-flex-warp jc-flex-vertical">
            <div class="jc-list-item-content-title">非机动车乱停放</div>
            <div class="jc-list-item-content-position">开城路溧水区开城路188号</div>
            <div class="jc-list-item-content-detail jc-flex-warp">
              <span>上报人：张三</span>
              <span>单位：溧水区</span>
              <span>12:22:59</span>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScreenDataStatisticsRealtimeContentEvent',
  data() {
    return {
      list: [1, 2, 3, 4, 5]
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {

    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.initData()
    }, 1000 * 60)
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-event {
  box-sizing: border-box;
  padding: 0 $jc-default-dis $jc-default-dis/2;
  overflow: auto;
}

.jc-title .jc-right-box {
  font-size: 14px;
  color: #8bc1fc;
}

.jc-event-list {
  overflow-x: hidden;
  overflow-y: auto;

  .jc-list-item {
    padding: 15px 0;
    height: 120px;
    border-bottom: 1px solid rgba($color: #20499a, $alpha: 0.8);

    .img {
      width: 140px;
    }

    .jc-list-item-content {
      padding: 0 20px;
      justify-content: space-between;

      .jc-list-item-content-title {
        color: #11e7ff;
        font-size: 16px;
      }

      .jc-list-item-content-position {
        color: #8bc1fc;
        font-size: 14px;
      }

      .jc-list-item-content-detail {
        color: #8bc1fc;
        justify-content: space-between;
      }
    }
  }
}

//出场入场动画
.jc-list-enter-active,
.jc-list-leave-active {
  transition: transform 0.6s, opacity 0.6s;
}

.jc-list-enter,
.jc-list-leave-to {
  opacity: 0;
  transform: translateX(50%);
}

.jc-list-leave-active {
  position: absolute;
}

.jc-list-move {
  transition: transform 0.6s;
}
</style>
