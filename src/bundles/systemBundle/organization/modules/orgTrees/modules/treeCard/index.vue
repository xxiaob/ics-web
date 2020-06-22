<template>
  <div class="jc-tree-card" v-loading="loading">
    <el-tree ref="tree" :default-expanded-keys="expandedKeys" :data="trees" :props="props" :filter-node-method="filterNode" node-key="orgId" @node-click="nodeClick" :expand-on-click-node="false" :highlight-current="true">
      <div class="custom-tree-node" slot-scope="{ node }">
        <div class="jc-text-warp" v-text="node.label"></div>
      </div>
    </el-tree>
  </div>
</template>
<script>
import TreesFilterMixins from '@/mixins/TreesFilterMixins'
import { organizationList } from '@/api/organization'

export default {
  name: 'SystemOrganizationTreesTreeCard',
  mixins: [TreesFilterMixins],
  data() {
    return {
      loading: false,
      trees: [],
      expandedKeys: [],
      props: { children: 'children', label: 'label' }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (!this.loading) {
        this.loading = true
        organizationList().then(res => {
          this.trees = this.formatTree(res)
          if ( this.trees.length) {
            this.$nextTick(() => {
              let orgId = this.trees[0].orgId

              this.expandedKeys = [orgId]
              this.$refs.tree.setCurrentKey(orgId)
              this.$emit('node-change', { orgId: orgId, orgName: this.trees[0].label, type: 'manage' })
            })
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    formatTree(child, pName = '--') {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = {
            name: pName,
            pid: item.pid,
            orgId: item.orgId,
            label: item.orgName
          }

          let children = this.formatTree(item.children, node.orgName)

          if (children && children.length) {
            node.children = children
          }

          trees.push(node)
        })
      }
      return trees
    },
    nodeClick(data) {
      this.$emit('node-change', { orgId: data.orgId, orgName: data.label, type: 'node-click' })
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-tree-card {
  position: relative;
  min-height: 200px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  width: 0;
  font-size: $jc-font-size-small;
  padding-left: 15px;
  background: url(/static/areaicons/organization.png) no-repeat left center;
  background-size: 12px auto;
}
</style>
