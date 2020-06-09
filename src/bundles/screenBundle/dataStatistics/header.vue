<template>
  <header>
    <span class="title">行政执法系统</span>
    <span class="time">{{time}}</span>
    <span class="date">{{date}}</span>
    <span class="week">{{weeks[week]}}</span>
  </header>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      time: moment().format('HH:mm:ss'),
      date: moment().format('YYYY-MM-DD'),
      week: moment().day(),
      weeks: {
        0: '周日',
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六'
      }
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.time = moment().format('HH:mm:ss')
      this.date = moment().format('YYYY-MM-DD')
      this.week = moment().day()
    }, 1000)
  },
  destroyed() {
    clearInterval(this.interval)
  }
}
</script>

<style lang="scss" scoped>
header {
  background: url(./assets/head.png) no-repeat;
  background-size: 100% 100%;
  height: 70px;
  text-align: center;
  position: relative;
}
.title {
  font-family: "黑体";
  line-height: 60px;
  color: white;
  font-size: 30px;
  font-weight: bold;
}
.time {
  position: absolute;
  top: 5px;
  left: 10px;
  font-size: 24px;
  line-height: 24px;
}
.date {
  position: absolute;
  top: 10px;
  left: 120px;
  font-size: 18px;
  line-height: 18px;
  color: #1292f6;
  font-size: "微软雅黑";
}
.week {
  position: absolute;
  top: 9px;
  left: 240px;
  font-size: 18px;
  line-height: 18px;
  color: #1292f6;
  font-size: "微软雅黑";
}
</style>
