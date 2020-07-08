<template>
  <header>
    <span class="title">{{title}}</span>
    <span class="time">{{time}}</span>
    <span class="date">{{date}}</span>
    <span class="week">{{weeks[week]}}</span>
  </header>
</template>

<script>
import moment from 'moment'
import { projectGet } from '@/api/projects'
import { PROJECT_TYPES } from '@/constant/Dictionaries'
import { organizationList } from '@/api/organization'
import { getUser } from '@/libs/storage'
const orgMap = {}

export default {
  name: 'jcHeader',
  data() {
    return {
      title: '--',
      project: {},
      orgs: [],
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
  async created() {
    if (this.$route.params.projectId) {
      console.log(this.$route.params)
      //处理项目，如果项目id存在则获取项目详情
      let { projectId, projectName, orgId, projectType } = await projectGet(this.$route.params.projectId)

      this.project = { projectId, projectName, orgId, projectType }
    }

    const res = await organizationList()

    this.orgs = this.formatOrg(res)
    let parentOrg = this.orgs[0]

    //处理标题显示
    if (PROJECT_TYPES.SpecialControl == this.project.projectType || PROJECT_TYPES.EmergencySupport == this.project.projectType) {
      this.title = `${this.project.projectName}数据大屏`
      this.org = { name: this.project.projectName, orgId: this.project.orgId }
    } else {
      let user = getUser()

      if (user && user.userRespInnerDTO && user.userRespInnerDTO.dataScreenLogo) {
        this.title = user.userRespInnerDTO.dataScreenLogo
      } else {
        this.title = `${parentOrg.label}常态数据大屏`
      }

      this.org = { ...orgMap[parentOrg.value] }
    }
    this.$EventBus.$emit('org-change', this.org) //使用事件总线进行级别切换通知
  },
  mounted() {
    this.interval = setInterval(() => {
      this.time = moment().format('HH:mm:ss')
      this.date = moment().format('YYYY-MM-DD')
      this.week = moment().day()
    }, 1000)
  },
  methods: {
    formatOrg(child) {
      if (child && child.length) {
        let orgs = []

        child.forEach(item => {
          orgs.push({ value: item.orgId, label: item.orgName,
            ...(item.children && item.children.length ? { children: this.formatOrg(item.children) } : {}) })
          orgMap[item.orgId] = { orgId: item.orgId, name: item.orgName }
        })
        return orgs
      }
      return []
    }
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
