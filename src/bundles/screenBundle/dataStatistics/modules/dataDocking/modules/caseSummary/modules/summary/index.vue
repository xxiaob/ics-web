<template>
  <div class="jc-summary jc-flex-con jc-flex-warp">
    <div class="jc-summary-round-wrap jc-flex-con" ref="summaryWrap">

      <!-- 旋转小球 -->
      <div class="jc-summary-round summary-round-1">
        <div class="jc-summary-round-content jc-flex-warp jc-flex-vertical">
          <div class="jc-summary-count jc-flex-con-4 jc-flex-warp">
            <span>39件</span>
          </div>
          <div class="jc-summary-title jc-flex-con-3 jc-flex-warp">
            <span>餐饮油烟</span>
          </div>
        </div>
      </div>

      <div class="jc-summary-round summary-round-2">
        <div class="jc-summary-round-content jc-flex-warp jc-flex-vertical">
          <div class="jc-summary-count jc-flex-con-4 jc-flex-warp">
            <span>41%</span>
          </div>
          <div class="jc-summary-title jc-flex-con-3 jc-flex-warp">
            <span>结案率</span>
          </div>
        </div>
      </div>
      <div class="jc-summary-round summary-round-3">
        <div class="jc-summary-round-content jc-flex-warp jc-flex-vertical">
          <div class="jc-summary-count jc-flex-con-4 jc-flex-warp">
            <span>39件</span>
          </div>
          <div class="jc-summary-title jc-flex-con-3 jc-flex-warp">
            <span>处理中</span>
          </div>
        </div>
      </div>
      <div class="jc-summary-round summary-round-4">
        <div class="jc-summary-round-content jc-flex-warp jc-flex-vertical">
          <div class="jc-summary-count jc-flex-con-4 jc-flex-warp">
            <span>39件</span>
          </div>
          <div class="jc-summary-title jc-flex-con-3 jc-flex-warp">
            <span>已结案</span>
          </div>
        </div>
      </div>
      <div class="jc-summary-round summary-round-5">
        <div class="jc-summary-round-content jc-flex-warp jc-flex-vertical">
          <div class="jc-summary-count jc-flex-con-4 jc-flex-warp">
            <span>39件</span>
          </div>
          <div class="jc-summary-title jc-flex-con-3 jc-flex-warp">
            <span>渣土运输</span>
          </div>
        </div>
      </div>
      <div class="jc-summary-round summary-round-6">
        <div class="jc-summary-round-content jc-flex-warp jc-flex-vertical">
          <div class="jc-summary-count jc-flex-con-4 jc-flex-warp">
            <span>39件</span>
          </div>
          <div class="jc-summary-title jc-flex-con-3 jc-flex-warp">
            <span>水务执法</span>
          </div>
        </div>
      </div>
      <div class="jc-summary-round summary-round-7">
        <div class="jc-summary-round-content jc-flex-warp jc-flex-vertical">
          <div class="jc-summary-count jc-flex-con-4 jc-flex-warp">
            <span>39件</span>
          </div>
          <div class="jc-summary-title jc-flex-con-3 jc-flex-warp">
            <span>违章建筑</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 案件总数,中央文字区域 -->
    <div class="jc-summary-center-content jc-flex-warp jc-flex-vertical">
      <div class="jc-summary-center-count jc-flex-con-2 jc-flex-warp">
        <span>
          <count-to class="jc-center-count" :startVal="startVal" :endVal="endVal" :duration="5000" /> 件
        </span>
      </div>
      <div class="jc-summary-center-title jc-flex-con-3 jc-flex-warp">
        <span>案件总数</span>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to'
export default {
  name: 'ScreenDataStatisticsDataDockingCaseSummarySummary',
  components: { countTo },
  data() {
    return {
      startVal: 0,
      endVal: 0
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize)
    this.$once('hook:beforeDestroy', () =>{
      window.removeEventListener('resize', this.resize)
    })

    this.$nextTick(() => {
      this.resize()
    })
  },
  methods: {
    resize() {
      const width = this.$refs.summaryWrap.clientWidth - 100
      const height = this.$refs.summaryWrap.clientHeight - 26

      let count = 30

      let oStyle = document.head.querySelector('.animation')

      if (!oStyle) {
        oStyle = document.createElement('style')
        oStyle.type = 'text/css'
        oStyle.className = 'animation'
      }
      let keyframeVal = '@keyframes jc-summary-move{'

      for (let index = 0; index < count + 1; index++) {
        let keyframe = index / count * 100

        let offsetX = (width / 2 * Math.cos(2 * Math.PI / count * index)) // 水平位移

        let offsetY = (height / 2 * Math.sin(2 * Math.PI / count * index)) // 垂直位移

        keyframeVal += `
          ${keyframe}%{
            transform: translateX(${offsetX}px) translateY(${offsetY}px);
            z-index: ${50 - keyframe};
          }
        `
      }

      keyframeVal += '}'

      oStyle.innerHTML = keyframeVal

      // 延迟动画
      setTimeout(() =>{
        this.$refs.summaryWrap.style.opacity = '1' // 动画元素显示

        document.head.appendChild(oStyle) // css动画样式添加到head中

        this.$forceUpdate() // 属性

        this.endVal = 99 // 改变显示数字
      }, 5000)
    }


  }
}
</script>

<style lang="scss" scoped>
.jc-summary {
  position: absolute;
  width: 100%;
  height: 100%;

  &::after {
    content: "";
    position: absolute;
    top: -12%;
    left: 10%;
    right: 10%;
    bottom: -24%;
    background: url("./assets/summary-center.png") no-repeat center top/30% 66%;
  }

  .jc-summary-round-wrap {
    opacity: 0;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    transform: translateZ(0);

    .jc-summary-round {
      position: absolute;
      width: 14%;
      padding-top: 14%;
      border-radius: 50%;
      background: url("./assets/summary-round.png") no-repeat center/100%;
      animation: jc-summary-move 14s linear infinite backwards;

      &.summary-round-2 {
        animation-delay: 2s;
      }

      &.summary-round-3 {
        animation-delay: 4s;
      }

      &.summary-round-4 {
        animation-delay: 6s;
      }

      &.summary-round-5 {
        animation-delay: 8s;
      }

      &.summary-round-6 {
        animation-delay: 10s;
      }

      &.summary-round-7 {
        animation-delay: 12s;
      }

      .jc-summary-round-content {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;

        .jc-summary-count {
          justify-content: center;
          align-items: center;
          font-size: 16px;
          font-weight: bold;
          color: #11e7ff;
        }
        .jc-summary-title {
          justify-content: center;
          align-items: flex-start;
          font-size: 12px;
          color: #11e7ff;
        }
      }
    }
  }

  .jc-summary-center-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;

    .jc-summary-center-count {
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #11e7ff;

      .jc-center-count {
        font-size: 28px;
      }
    }

    .jc-summary-center-title {
      justify-content: center;
      align-items: flex-start;
      font-weight: bold;
      color: #ffffff;
    }
  }
}
</style>
