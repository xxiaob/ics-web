<template>
  <div ref="echarts" class="mv-chart-canvas"></div>
</template>
<script>
import echarts from 'echarts'

let myChart = {}//接收echarts

export default {
  name: 'JcCharts',
  data() {
    return {
      uid: this['_uid']
    }
  },
  props: {
    isClear: false,
    options: {
      type: Object,
      default() {
        return null
      }
    }
  },
  watch: {
    options: {
      deep: true,
      handler() {
        console.log('ChartsLine options Change：', this.options)
        this.drawChart()
      }
    }
  },
  mounted() {
    this.drawChart()
    window.addEventListener('resize', this.resize)
  },
  methods: {
    drawChart() {
      if (!this.$refs.echarts || !this.options) {
        return
      }
      if (!myChart[this.uid]) {
        console.log('ChartsLine add uid' + this.uid)
        myChart[this.uid] = echarts.init(this.$refs.echarts)
      } else {
        if (this.isClear) {
          myChart[this.uid].clear()
        }
      }
      myChart[this.uid].setOption(this.options)
    },
    resize() {
      console.log('ChartsLine window size Change')
      if (myChart[this.uid]) {
        myChart[this.uid].resize()
      }
    }
  },
  beforeDestroy() {
    if (myChart[this.uid]) {
      console.log('ChartsLine destroy uid' + this.uid)
      myChart[this.uid].clear()
      myChart[this.uid].dispose()
      myChart[this.uid] = null
    }
    window.removeEventListener('resize', this.resize)
  }
}
</script>
<style lang="scss" scoped>
.mv-chart-canvas {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
