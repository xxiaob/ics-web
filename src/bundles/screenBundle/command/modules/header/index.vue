<template>
  <div class="jc-screen-header no-select">
    <div class="jc-header-left">
      <div class="jc-weather" v-if="weather" :style="`background-image: url(${weather.source});`">
        <span v-text="weather.temperature + '℃'"></span>
        <div class="jc-weather-detail">
          <div class="jc-w-detail" :style="`background-image: url(${weather.source});`">{{weather.weather}}<br />{{weather.temperature + '℃'}}</div>
          <div class="jc-weather-item">风向：{{weather.windDirection}}</div>
          <div class="jc-weather-item">风力：{{weather.windPower}}</div>
          <div class="jc-weather-item">空气湿度：{{weather.humidity}}</div>
        </div>
      </div>
      <div class="jc-time" v-text="time"></div>
      <div class="jc-date" v-text="dateTime"></div>
    </div>
    <div class="jc-screen-title" v-text="title"></div>
    <div class="jc-header-right">
      <div class="jc-grid" title="网格" @click="viewChange('CommandGrid')">
        <i class="iconfont iconwangge"></i>
      </div>
      <div class="jc-org" title="组织结构" @click="viewChange('CommandOrg')"></div>
      <!-- 组织设备 -->
      <div class="jc-device" title="组织设备" @click="viewChange('CommandDevice')"></div>

      <!-- 组织层级 -->
      <div class="jc-org-switch">
        <div class="jc-org-text" v-text="org.name"></div>
        <div class="jc-org-cascader" v-if="orgs.length">
          <el-cascader-panel ref='myOrgCascader' v-model="org.orgId" :options="orgs" :props="{ checkStrictly: true, emitPath: false }" @change="orgChange"></el-cascader-panel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import JcWeather from '@/components/JcWeather'
import { organizationList } from '@/api/organization'
import { PROJECT_TYPES } from '@/constant/Dictionaries'
import { getAreaCodeByOrgId } from '@/api/area'
import { getUser } from '@/libs/storage'

let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] //周数据

let orgMap = {} //存储组织id和住址信息的对应关系

export default {
  name: 'ScreenCommandHeader',
  data() {
    return {
      title: '--',
      weather: null,
      time: '',
      dateTime: '',
      project: null,
      orgs: [], //存储组织树,用于cascader选择器使用
      org: { name: '--', orgId: '' },
      timeInterval: null
    }
  },
  created() {
    console.log('screen-command-header-created')
    this.timeInterval = setInterval(this.setTime, 1000)
    this.$EventBus.$on('org-change', this.setWeather) //监听需要切换天气
    this.$EventBus.$on('command-init-success', this.initSuccess) //监听基础数据初始化完成
  },
  methods: {
    async initData() {
      try {
        const res = await organizationList()

        this.orgs = this.formatOrg(res)
        if (this.orgs.length) {
          let parentOrg = this.orgs[0]

          this.orgChange(parentOrg.value)
          //处理标题显示
          if (PROJECT_TYPES.SpecialControl == this.project.projectType) {
            this.title = `${this.project.projectName}指挥大屏`
          } else {
            let user = getUser()

            if (user && user.userRespInnerDTO && user.userRespInnerDTO.commandScreenLogo) {
              this.title = user.userRespInnerDTO.commandScreenLogo
            } else {
              this.title = `${parentOrg.label}常态指挥大屏`
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
      return false
    },
    initSuccess(data) {
      console.log('header-command-init-success', data)
      this.project = data
      //初始化组织,如果是应急，则直接设置，否则去获取组织结构
      if (PROJECT_TYPES.EmergencySupport == this.project.projectType) {
        this.title = `${this.project.projectName}指挥大屏`
        this.org = { name: this.project.projectName, orgId: this.project.orgId }
        this.$EventBus.$emit('org-change', this.org) //使用事件总线进行级别切换通知
      } else {
        this.initData()
      }
    },
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
    },
    orgChange(orgId) {
      //行政区域切换
      this.org = { ...orgMap[orgId] }
      this.$EventBus.$emit('org-change', this.org) //使用事件总线进行级别切换通知
    },
    async setWeather(org) {
      try {
        let result = await getAreaCodeByOrgId(org.orgId)

        console.log('header-setWeather', result)
        let myWeather = new JcWeather()

        this.weather = await myWeather.getWeather(result.areaCode)

        console.log('command-header-weather', this.weather, org)
      } catch (error) {
        console.log(error)
      }
    },
    viewChange(name) {
      this.$EventBus.$emit('view-component-change', { component: name, options: null }) //通知窗口改变
    },
    setTime() {
      this.dateTime = moment().format(`YYYY年MM月DD日 ${weeks[moment().day()]}`)
      this.time = moment().format('HH:mm:ss')
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInterval)
    //去除事件监听
    this.$EventBus.$off('org-change', this.setWeather)
    this.$EventBus.$off('command-init-success', this.initSuccess)
  }
}
</script>
