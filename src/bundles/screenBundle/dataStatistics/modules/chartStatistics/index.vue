<template>
  <div class="jc-flex-warp jc-chart-statistics jc-flex-vertical" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div class="jc-top jc-flex-warp">
      <div class="jc-flex-con" :class="{'jc-activated':activated===1}" @click="changeCycle(1)">日</div>
      <div class="jc-flex-con" :class="{'jc-activated':activated===7}" @click="changeCycle(7)">周</div>
      <div class="jc-flex-con" :class="{'jc-activated':activated===30}" @click="changeCycle(30)">月</div>
    </div>
    <jc-info class="jc-chart-comp" :cycle="activated" :infoAndArea="infoAndArea"></jc-info>
    <jc-area class="jc-chart-comp" :cycle="activated" :infoAndArea="infoAndArea"></jc-area>
    <jc-type class="jc-chart-comp" :date="date"></jc-type>
  </div>
</template>

<script>
import JcInfo from './modules/info'
import JcArea from './modules/area'
import JcType from './modules/type'
import { getAccumulateInfo } from '@/api/dataScreen'
import moment from 'moment'

export default {
  name: 'ScreenDataStatisticsChartStatistics',
  components: {
    JcInfo,
    JcArea,
    JcType
  },
  data() {
    return {
      activated: 7,
      loading: false,
      project: {},
      today: new Date(moment().format('YYYY-MM-DD') + ' 00:00:00').getTime(),
      date: {
        beginTime: null,
        endTime: null
      },
      infoAndArea: {
        areas: [],
        events: [],
        problems: [],
        problems1: [],
        problems2: [],
        problems3: [],
        tasks: [],
        tasks1: [],
        tasks2: [],
        tasks3: []
      },
      intervalTime: 30000
    }
  },
  created() {
    this.date.beginTime = new Date(this.today - 6 * 24 * 60 * 60 * 1000)
    this.date.endTime = new Date(this.today + 24 * 60 * 60 * 1000)

    this.$EventBus.$on('data-statistics-init-success', val=>{
      console.log('chartStatistics 接收信息成功', val)
      this.project = val
      this.initData()
    })
  },
  watch: {
    activated(newValue) {
      if (newValue === 1) {
        this.date.beginTime = new Date(this.today)
      } else if (newValue === 7) {
        this.date.beginTime = new Date(this.today - 6 * 24 * 60 * 60 * 1000)
      } else if (newValue === 30) {
        this.date.beginTime = new Date(this.today - 29 * 24 * 60 * 60 * 1000)
      }
      this.initData()
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.changeCycle()
    }, this.intervalTime)
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const res = await getAccumulateInfo({ ...this.date, projectId: this.project.projectId })

          this.processData(res)
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },
    processData({ eventGroupByOrgIdRespList, problemGroupByOrgIdRespList, tempTaskGroupByOrgIdRespList }) {
      const areas = [], events = [], problems = [], problems1 = [], problems2 = [], problems3 = [], tasks = [], tasks1 = [], tasks2 = [], tasks3 = []

      // console.log('eventGroupByOrgIdRespList', eventGroupByOrgIdRespList)
      //事件数据
      eventGroupByOrgIdRespList.forEach(item=>{
        areas.push(item.orgName)
        events.push(item.orgEventCount)
      })
      this.infoAndArea.areas = areas
      this.infoAndArea.events = events

      // console.log('problemGroupByOrgIdRespList', problemGroupByOrgIdRespList)
      // console.log('tempTaskGroupByOrgIdRespList', tempTaskGroupByOrgIdRespList)
      areas.forEach(area=>{
        //问题数据
        let problemCount = 0
        const problemList = problemGroupByOrgIdRespList.filter(item=>item.orgName === area)

        problemList.forEach(item=>{
          problemCount += item.problemStatusCount
          if (item.problemStatus === 1) {
            problems1.push(item.problemStatusCount)
          } else if (item.problemStatus === 2) {
            problems2.push(item.problemStatusCount)
          } else if (item.problemStatus === 3) {
            problems3.push(item.problemStatusCount)
          }
        })

        problems.push(problemCount)

        //任务数据
        let taskCount = 0
        const taskList = tempTaskGroupByOrgIdRespList.filter(item=>item.orgName === area)

        taskList.forEach(item=>{
          taskCount += item.taskStatusCount
          if (item.taskStatus === 1) {
            tasks1.push(item.taskStatusCount)
          } else if (item.taskStatus === 2) {
            tasks2.push(item.taskStatusCount)
          } else if (item.taskStatus === 3) {
            tasks3.push(item.taskStatusCount)
          }
        })

        tasks.push(taskCount)
      })

      this.infoAndArea.problems = problems
      this.infoAndArea.problems1 = problems1
      this.infoAndArea.problems2 = problems2
      this.infoAndArea.problems3 = problems3

      this.infoAndArea.tasks = tasks
      this.infoAndArea.tasks1 = tasks1
      this.infoAndArea.tasks2 = tasks2
      this.infoAndArea.tasks3 = tasks3
    },
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
      console.log('ChartStatistics mouseenter')
      if (this.interval) {
        clearInterval(this.interval)
      }
    },
    mouseleave() {
      console.log('ChartStatistics mouseleave')
      this.interval = setInterval(() => {
        this.changeCycle()
      }, this.intervalTime)
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
