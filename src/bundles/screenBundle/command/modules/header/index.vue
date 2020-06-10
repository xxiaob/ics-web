<template>
  <div class="jc-screen-header no-select">
    <div class="jc-header-left">
      <div class="jc-weather" v-if="weather" :class="getWeatherStyle()">
        <span v-text="weather.temperature + '℃'"></span>
        <div class="jc-weather-detail">
          <div class="jc-w-detail" :class="getWeatherStyle()">{{weather.weather}}<br />{{weather.temperature + '℃'}}</div>
          <div class="jc-weather-item">风向：{{weather.windDirection}}</div>
          <div class="jc-weather-item">风力：{{weather.windPower}}</div>
          <div class="jc-weather-item">空气湿度：{{weather.humidity}}</div>
        </div>
      </div>
      <div class="jc-time" v-text="time"></div>
    </div>
    <div class="jc-screen-title" v-text="title"></div>
    <div class="jc-header-right">
      <div class="jc-grid" title="网格" @click="viewChange('CommandGrid')"></div>
      <div class="jc-org" title="组织结构" @click="viewChange('CommandOrg')"></div>
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
import { JC_WEATHER } from '@/constant/Dictionaries'

let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'] //星期数据

//天气和样式映射
let weatherStyleMapping = {
  [JC_WEATHER.SUNNY]: 'jc-weather-sunny',
  [JC_WEATHER.OVERCAST]: 'jc-weather-overcast',
  [JC_WEATHER.SMOG]: 'jc-weather-smog',
  [JC_WEATHER.RAIN]: 'jc-weather-rain',
  [JC_WEATHER.SNOW]: 'jc-weather-snow'
}

let orgMap = {} //存储组织id和住址信息的对应关系

export default {
  name: 'ScreenCommandHeader',
  data() {
    return {
      title: '--',
      weather: null,
      time: '',
      project: null,
      orgs: [], //存储组织树,用于cascader选择器使用
      org: { name: '--', orgId: '' },
      timeInterval: null
    }
  },
  created() {
    this.timeInterval = setInterval(this.setTime, 1000)
    this.$EventBus.$on('org-adcode-change', this.setWeather) //监听需要切换天气
    this.$EventBus.$on('command-init-success', this.initSuccess) //监听基础数据初始化完成

    this.setWeather({ areaCode: '南京' })
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
            this.title = `${parentOrg.label}常态指挥大屏`
          }
        }
      } catch (error) {
        console.log(error)
      }
      return false
    },
    initSuccess(data) {
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
    getWeatherStyle(type) {
      return weatherStyleMapping[type || this.weather.type]
    },
    orgChange(orgId) {
      //行政区域切换
      this.org = { ...orgMap[orgId] }
      this.$EventBus.$emit('org-change', this.org) //使用事件总线进行级别切换通知
    },
    async setWeather(org) {
      if (org && org.areaCode) {
        let myWeather = new JcWeather()

        this.weather = await myWeather.getWeather(org.areaCode)

        let forecastWeather = await myWeather.getForecastWeather(org.areaCode)

        console.log('command-header-weather', this.weather, forecastWeather)
      }
    },
    viewChange(name) {
      this.$EventBus.$emit('view-component-change', { component: name, options: null }) //通知窗口改变
    },
    setTime() {
      this.time = moment().format(`YYYY年MM月DD日 ${weeks[moment().day()]} HH:mm:ss`)
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInterval)
    //去除事件监听
    this.$EventBus.$off('org-adcode-change', this.setWeather)
    this.$EventBus.$off('command-init-success', this.initSuccess)
  }
}
</script>
