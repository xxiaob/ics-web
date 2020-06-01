<template>
  <div class="jc-screen-header no-select">
    <div class="jc-header-left">
      <div class="jc-weather">28 ℃</div>
      <div class="jc-time" v-text="time"></div>
    </div>
    <div class="jc-screen-title">南京市常态管控指挥大屏</div>
    <div class="jc-header-right">
      <div class="jc-grid" title="网格"></div>
      <div class="jc-org" title="组织结构"></div>
      <div class="jc-org-switch">
        <div class="jc-org-text" v-text="org.name" @click="orgVisible = !orgVisible"></div>
        <div class="jc-org-cascader" :class="{'jc-org-show': orgVisible}">
          <el-cascader-panel v-model="orgId" :options="orgs" :props="{ checkStrictly: true, emitPath: true }" @change="orgChange"></el-cascader-panel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { organizationList } from '@/api/organization'

let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

export default {
  name: 'ScreenCommandHeader',
  data() {
    return {
      weather: {},
      time: '',
      orgs: [],
      orgId: '',
      orgVisible: false,
      org: { name: '--' },
      timeInterval: null
    }
  },
  created() {
    this.timeInterval = setInterval(this.setTime, 1000)
    this.initData()
  },
  methods: {
    async initData() {
      try {
        const res = await organizationList()

        this.orgs = this.formatOrg(res)
      } catch (error) {
        console.log(error)
      }
    },
    formatOrg(child) {
      if (child && child.length) {
        let orgs = []

        child.forEach(item => {
          orgs.push({ value: item.orgId, label: item.orgName,
            ...(item.children && item.children.length ? { children: this.formatOrg(item.children) } : {}) })
        })
        return orgs
      }
      return []
    },
    orgChange(org) {
      //行政区域切换
      console.log(arguments)
    },
    setTime() {
      this.time = moment().format(`YYYY年MM月DD日 ${weeks[moment().day()]} HH:mm:ss`)
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInterval)
  }
}
</script>
