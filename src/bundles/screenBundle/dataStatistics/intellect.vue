<template>
  <div class="intellect">
    <div class="title">
      <span>AI智能分析事件数量</span>
      <!-- <span class="type">网巡类型top5</span>
      <span class="type selected">事件类型top5</span> -->
    </div>
    <div class="dateType">
      <span :class="dateActive===0?'selected':''" @click="dateChange(0)">日</span>
      <span :class="dateActive===1?'selected':''" @click="dateChange(1)">周</span>
      <span :class="dateActive===2?'selected':''" @click="dateChange(2)">月</span>
    </div>
    <div class="echarts" ref="echarts"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'intellect',
  data() {
    return {
      dateActive: 0
    }
  },
  mounted() {
    this.renderEcharts()

    window.addEventListener('resize', () => {
      console.log('echarts resize')
      if (this.echarts) {
        this.echarts.resize()
      }
    })
  },
  methods: {
    dateChange(v) {
      this.dateActive = v
      this.echartsChange()
    },
    echartsChange() {
      if (this.echarts) {
        const arr1 = [
          { value: 335, name: '非机动车乱停放' },
          { value: 310, name: '机动车乱停放' },
          { value: 274, name: '渣土车非法上路' },
          { value: 235, name: '暴露垃圾' },
          { value: 400, name: '游街商贩' }
        ]

        arr1.forEach(item=>{
          item.value = Math.round(400 * Math.random())
        })
        this.echartsOptions.series[0].data = arr1.sort( (a, b)=> b.value - a.value)
        this.echarts.setOption(this.echartsOptions)
      }
    },
    renderEcharts() {
      this.echarts = echarts.init(this.$refs.echarts)
      this.echartsOptions = {
        color: [ '#409eff', '#51cefc', '#20a867', '#e7fc01', '#fcbe01', '#ff7140', '#fd5503', '#e22d14', '#04dcfc', '#bb55eb', '#fb2087' ],
        textStyle: {
          color: 'white',
          fontSize: 12
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '事件总数',
            type: 'pie',
            radius: ['25%', '65%'],
            center: ['50%', '50%'],
            data: [
              { value: 335, name: '非机动车乱停放' },
              { value: 310, name: '机动车乱停放' },
              { value: 274, name: '渣土车非法上路' },
              { value: 235, name: '暴露垃圾' },
              { value: 400, name: '游街商贩' }
            ].sort( (a, b)=> b.value - a.value),
            roseType: 'radius',
            // labelLine: {
            //   lineStyle: {
            //     color: 'white'
            //   },
            //   smooth: 0.2,
            //   length: 10,
            //   length2: 20
            // },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: ()=> {
              return Math.random() * 200
            }
          }
        ]
      }
      this.echarts.setOption(this.echartsOptions)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
