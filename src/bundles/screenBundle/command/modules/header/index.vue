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
      this.$emit('org-change', this.org)
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
