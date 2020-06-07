<template>
  <div class="jc-screen-header no-select">
    <div class="jc-header-left">
      <div class="jc-weather"></div>
      <div class="jc-time" v-text="time"></div>
    </div>
    <div class="jc-screen-title">南京市常态管控指挥大屏</div>
    <div class="jc-header-right">
      <div class="jc-grid" title="网格" @click="viewChange('CommandGrid')"></div>
      <div class="jc-org" title="组织结构" @click="viewChange('CommandOrg')"></div>
      <div class="jc-org-switch">
        <div class="jc-org-text" v-text="org.name"></div>
        <div class="jc-org-cascader">
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

let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

let orgMap = {} //存储组织id和住址信息的对应关系

export default {
  name: 'ScreenCommandHeader',
  data() {
    return {
      weather: {},
      time: '',
      orgs: [], //存储组织树,用于cascader选择器使用
      org: { name: '--', orgId: '' },
      timeInterval: null
    }
  },
  created() {
    this.timeInterval = setInterval(this.setTime, 1000)
    this.initData()
    this.$EventBus.$on('org-adcode-change', this.setWeather) //监听需要切换天气
  },
  methods: {
    async initData() {
      try {
        const res = await organizationList()

        this.orgs = this.formatOrg(res)
        if (this.orgs.length) {
          this.orgChange(this.orgs[0].value)
        }
      } catch (error) {
        console.log(error)
      }
      return false
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
      if (org && org.areaCode) {
        let myWeather = new JcWeather()

        let result = await myWeather.getWeather(org.areaCode)

        console.log('command-header-weather', result)
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
  }
}
</script>
