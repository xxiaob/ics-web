<template>
  <view-warp title="网格">
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <el-tree ref="tree" :default-expanded-keys="expandedKeys" :load="loadNode" lazy :props="props" :filter-node-method="filterNode" node-key="id">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <div class="jc-tree-label no-select" :style="getIconStyle(data.icon)">
            <div class="jc-text-warp" v-text="data.name" :title="data.name"></div>
          </div>
          <div class="jc-tree-options" v-on:click.stop>
            <el-button type="text" size="small" icon="el-icon-map-location" @click="goLocation(data)"></el-button>
            <el-button type="text" size="small" icon="el-icon-view" v-if="data.areaId" @click="gridDetail(data)" title="详情"></el-button>
          </div>
        </div>
      </el-tree>
    </div>
  </view-warp>
</template>
<script>
import TreesFilterMixins from '@/mixins/TreesFilterMixins'
import { organizationList } from '@/api/organization'
import { JcIcons } from '@/config/JcIconConfig'
import { areaList } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import { PROJECT_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'ScreenCommandGrid',
  mixins: [TreesFilterMixins],
  props: ['options', 'project'],
  components: {
    ViewWarp: () => import('../common/viewWarp')
  },
  data() {
    return {
      loading: false,
      filterText: '',
      orgs: {},
      parentNode: [],
      expandedKeys: [],
      props: { children: 'children', label: 'name' }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      //初始化组织,如果是应急项目，则使用项目名称作为父级，如果是专项,则需要初始化默认组织
      if (PROJECT_TYPES.EmergencySupport == this.project.projectType) {
        this.expandedKeys = [this.project.orgId]
        this.parentNode = [{ id: this.project.orgId, orgId: this.project.orgId, name: this.project.projectName }]
      } else {
        try {
          const res = await organizationList()

          if (res && res.length) {
            let item = res[0]

            this.expandedKeys = [item.orgId]
            this.parentNode = [{ id: item.orgId, pid: item.pid, pName: '--', orgId: item.orgId, name: item.orgName }]
            this.formatOrg(item.children, item.orgName)
          }
        } catch (error) {
          console.log(error)
        }
      }

      this.loading = false
    },
    formatOrg(child, pName = '--') {
      if (child && child.length) {
        let orgs = []

        child.forEach(item => {
          orgs.push({ id: item.orgId, pid: item.pid, pName, orgId: item.orgId, name: item.orgName })
          this.formatOrg(item.children, item.orgName)
        })
        this.orgs[orgs[0].pid] = orgs
      }
    },
    getIconStyle(icon) {
      if (icon) {
        let useIcon = JcIcons[icon] || {}

        return `background-image: url(${useIcon.icon || ''});`
      }
      return ''
    },
    async getNodes(node) {
      let result = []

      let params = { projectId: this.project.projectId, searchType: AREAS_SEARCH_TYPE.GRID }

      if (node.level === 0) {
        await this.initData()
        result = [...this.parentNode]
      } else {
        if (node.data.areaId) {
          Object.assign(params, { areaId: node.data.areaId })
        } else {
          let orgNode = this.orgs[node.data.orgId] || []

          result = [...orgNode]
          Object.assign(params, { orgId: node.data.orgId, orgSearchType: AREAS_TYPE.OWN })
        }
        const res = await areaList(params)

        console.log('查询的area list：', res)
        if (res && res.length) {
          res.forEach(item => {
            result.push({ id: item.areaId, pid: item.pid, pName: node.data.name, orgId: item.orgId, areaId: item.areaId, desc: item.desc, areaTypeId: item.areaTypeId, name: item.areaName, icon: item.icon })
          })
        }
      }

      return result
    },
    loadNode(node, resolve) {
      console.log(node)
      this.getNodes(node).then((data) => {
        resolve(data)
        if (this.currentKey) {
          let currentNode = this.$refs.tree.getNode(this.currentKey)

          this.goEdit(currentNode.data)
          this.$refs.tree.setCurrentKey(this.currentKey)
          this.currentKey = null
        }
      }).catch(() => {
        node.loading = false
        node.expanded = false
        node.loaded = false
        node.isLeaf = false
      })
      return false
    },
    gridDetail(data) {
      this.$EventBus.$emit('view-component-change', { component: 'GridDetail', options: { areaId: data.areaId, areaName: data.name, areaTypeId: data.areaTypeId, icon: data.icon } }) //通知窗口改变
    },
    goLocation(data) {
      //去定位
      console.log('screen-grid-location-data', data)
      if (data.areaId) {
        this.$EventBus.$emit('screen-grid-location', { id: data.id, areaTypeId: data.areaTypeId, icon: data.icon }) //通知网格定位
      } else {
        this.$EventBus.$emit('screen-org-location', { id: data.id }) //通知组织定位
      }
    }
  }
}
</script>
