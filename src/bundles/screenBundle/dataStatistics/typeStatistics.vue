<template>
  <div class="typeStatistics">
    <div class="title">
      <span>类型统计</span>
      <span class="type" :class="active===0?'selected':''" @click="change(0)">网巡类型top5</span>
      <span class="type" :class="active===1?'selected':''" @click="change(1)">事件类型top5</span>
    </div>
    <!-- <div class="dateType">
      <span>日</span>
      <span class="selected">周</span>
      <span>月</span>
    </div> -->
    <div class="echarts" ref="echarts"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'typeStatistics',
  data() {
    return {
      active: 0
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
    change(v) {
      this.active = v
      this.echartsChange()
    },
    echartsChange() {
      if (this.echarts) {
        const arr1 = [
          { value: 335, name: '雨花' },
          { value: 310, name: '秦淮' },
          { value: 274, name: '鼓楼' },
          { value: 235, name: '玄武' },
          { value: 400, name: '建邺' },
          { value: 335, name: '江宁' },
          { value: 310, name: '溧水' },
          { value: 274, name: '六合' },
          { value: 235, name: '高淳' },
          { value: 400, name: '栖霞' }
        ]

        arr1.forEach(item=>{
          item.value = Math.round(400 * Math.random())
        })
        this.echartsOptions.series[0].data = arr1.sort( (a, b)=> b.value - a.value).slice(0, 5)
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
              { value: 335, name: '雨花' },
              { value: 310, name: '秦淮' },
              { value: 274, name: '鼓楼' },
              { value: 235, name: '玄武' },
              { value: 400, name: '建邺' }
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
