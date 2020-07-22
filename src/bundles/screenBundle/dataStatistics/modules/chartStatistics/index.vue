<template>
  <div class="jc-flex-warp jc-chart-statistics jc-flex-vertical" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div class="jc-top jc-flex-warp">
      <div class="jc-flex-con" :class="{'jc-activated':activated===1}" @click="changeCycle(1)">日</div>
      <div class="jc-flex-con" :class="{'jc-activated':activated===7}" @click="changeCycle(7)">周</div>
      <div class="jc-flex-con" :class="{'jc-activated':activated===30}" @click="changeCycle(30)">月</div>
    </div>
    <jc-info class="jc-chart-comp" :cycle="activated"></jc-info>
    <jc-area class="jc-chart-comp" :cycle="activated"></jc-area>
    <jc-type class="jc-chart-comp" :cycle="activated"></jc-type>
  </div>
</template>

<script>
import JcInfo from './modules/info'
import JcArea from './modules/area'
import JcType from './modules/type'
export default {
  name: 'ScreenDataStatisticsChartStatistics',
  components: {
    JcInfo,
    JcArea,
    JcType
  },
  data() {
    return {
      activated: 1
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.changeCycle()
    }, 3000)
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    changeCycle(val) {
      if (val) {
        if (val !== this.activated) {
          this.activated = val
        } else {
          console.log('请勿重复点击')
        }
      } else {
        console.log('setInterval changeCycle', this.activated)
        if (this.activated === 1) {
          this.activated = 7
        } else if (this.activated === 7) {
          this.activated = 30
        } else if (this.activated === 30) {
          this.activated = 1
        }
      }
    },
    mouseenter() {
      console.log('mouseenter')
      if (this.interval) {
        clearInterval(this.interval)
      }
    },
    mouseleave() {
      console.log('mouseleave')
      this.interval = setInterval(() => {
        this.changeCycle()
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-chart-statistics {
  border: 1px solid rgb(32, 73, 154);
  box-shadow: inset 0 0 10px 0 rgb(32, 73, 154);

  .jc-top {
    height: 40px;
    color: rgb(5, 114, 189);
    text-align: center;
    line-height: 40px;
    border-bottom: 1px solid rgb(32, 73, 154);

    & > div {
      cursor: pointer;
    }

    .jc-activated {
      background: rgb(3, 60, 147);
      color: white;
    }
  }

  .jc-chart-comp {
    padding: 0 $jc-default-dis $jc-default-dis/2;
    box-sizing: border-box;
    &:not(:last-child) {
      border-bottom: 1px solid rgb(32, 73, 154);
    }
  }
}
</style>
