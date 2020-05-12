<template>
  <div class="jc-card jc-area-manage" :class="{'jc-area-hide': manageHide}">
    <div class="jc-area-controll" @click="manageHide = !manageHide"><i class="jc-area-icon el-icon-arrow-right"></i></div>
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-tree-warp" v-loading="loading">
      <el-tree ref="tree" :default-expanded-keys="expandedKeys" :load="loadNode" lazy :props="props" :filter-node-method="filterNode" node-key="id" @node-click="nodeClick" :expand-on-click-node="false" :highlight-current="true">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <div class="jc-tree-label">
            <div class="jc-text-warp" v-text="node.label"></div>
          </div>
          <div class="jc-tree-options" :class="{'jc-area': data.areaId}" v-on:click.stop>
            <el-button type="text" size="small" icon="el-icon-delete" class="jc-area-btn" @click="del(data)"></el-button>
            <el-button type="text" size="small" icon="el-icon-circle-plus-outline" @click="manage(data, 2)"></el-button>
            <el-button type="text" size="small" icon="el-icon-edit-outline" class="jc-area-btn" @click="manage(data, 1)"></el-button>
            <el-button type="text" size="small" icon="el-icon-view" :class="{'jc-view-off': !data.view}" @click="viewControll(data)"></el-button>
          </div>
        </div>
      </el-tree>
    </div>
    <jc-manage :options="info" :pNode="pNode" :visible.sync="visible" @save-success="saveSuccess"></jc-manage>
  </div>
</template>
<script>
import TreesFilterMixins from '@/mixins/TreesFilterMixins'
import OperaMixins from './modules/mixins/operaMixins'
import { organizationList } from '@/api/organization'
import { areaList } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'

export default {
  name: 'SystemGridManageTrees',
  mixins: [TreesFilterMixins, OperaMixins],
  components: {
    JcManage: () => import('./modules/manage')
  },
  data() {
    return {
      loading: false,
      manageHide: false,
      filterText: '',
      orgs: {},
      parentNode: [],
      expandedKeys: [],
      props: { children: 'children', label: 'name' }
    }
  },
  watch: {
    filterText(val) {
      this.filter(val)
    }
  },
  methods: {
    async initData() {
      if (!this.loading) {
        this.loading = true

        try {
          const res = await organizationList()

          if (res && res.length) {
            let item = res[0]

            this.expandedKeys = [item.orgId]
            this.parentNode = [{ id: item.orgId, pid: item.pid, pName: '--', orgId: item.orgId, name: item.orgName, view: false }]
            this.formatOrg(item.children, item.orgName)
          }

          this.loading = false
        } catch (error) {
          this.loading = false
        }

        return true
      }
    },
    formatOrg(child, pName = '--') {
      if (child && child.length) {
        let orgs = []

        child.forEach(item => {
          orgs.push({ id: item.orgId, pid: item.pid, pName, orgId: item.orgId, name: item.orgName, view: false })
          this.formatOrg(item.children, item.orgName)
        })
        this.orgs[orgs[0].pid] = orgs
      }
    },
    async getNodes(node) {
      let result = []

      let params = { searchType: AREAS_SEARCH_TYPE.GRID }

      if (node.level === 0) {
        await this.initData()
        result = [...this.parentNode]
        params = { orgId: this.parentNode.orgId, orgSearchType: AREAS_TYPE.OWN_AND_BRO }
      } else {
        let orgNode = this.orgs[node.data.orgId] || []

        result = [...orgNode]
        if (node.data.areaId) {
          params = { areaId: node.data.areaId }
        } else {
          params = { orgId: node.data.orgId, orgSearchType: AREAS_TYPE.OWN_AND_BRO }
        }
      }
      const res = areaList(params)

      return result
    },
    loadNode(node, resolve) {
      console.log(node)
      this.getNodes(node).then((data) => {
        resolve(data)
      }).catch(() => {
        node.loading = false
        node.expanded = false
        node.loaded = false
        node.isLeaf = false
      })
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-area-manage {
  position: absolute;
  right: $jc-default-dis;
  bottom: $jc-default-dis;
  width: $jc-trees-width * 1.2;
  z-index: 10;
  padding: $jc-default-dis/2 $jc-default-dis;
  transform: translateX(0);
  transition: transform 0.5s;
  will-change: transform;
  &.jc-area-hide {
    transform: translateX($jc-trees-width * 1.2 + $jc-default-dis);
    .jc-area-controll {
      .jc-area-icon {
        transform: rotate(180deg);
      }
    }
  }
}
$jc-controll-width: 38px;
.jc-area-controll {
  position: absolute;
  width: $jc-controll-width;
  height: $jc-controll-width;
  line-height: $jc-controll-width;
  top: 50%;
  left: -$jc-controll-width;
  color: $jc-color-primary;
  z-index: 9;
  background-color: $jc-color-white;
  border-radius: 100% 0 0 100%;
  transform: translate(50%, -50%);
  cursor: pointer;
  .jc-area-icon {
    width: 16px;
    height: 16px;
    text-align: center;
    font-weight: bold;
    font-size: $jc-font-size-medium;
    vertical-align: middle;
    transform: rotate(0);
    transition: transform 0.5s;
    will-change: transform;
    margin-left: 4px;
  }
}
.jc-tree-warp {
  position: absolute;
  top: 48px;
  left: $jc-default-dis;
  right: $jc-default-dis;
  bottom: $jc-default-dis;
  overflow: auto;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  .jc-tree-label {
    flex: 1;
    width: 0;
    font-size: $jc-font-size-small;
    padding-left: 15px;
    background: url(/static/areaicons/organization.png) no-repeat left center;
    background-size: 12px auto;
  }
  .jc-tree-options {
    width: 36px;
    padding-top: 2px;
    .jc-area-btn {
      display: none;
    }
    &.jc-area {
      width: 64px;
      .jc-area-btn {
        display: block;
      }
    }
    .el-button {
      padding: 0;
      margin-left: 2px;
      float: right;
    }
    .jc-view-off {
      color: $jc-color-text-secondary;
    }
  }
}
</style>
