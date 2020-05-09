<template>
  <div class="jc-card jc-area-manage">
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-tree-warp" v-loading="loading">
      <el-tree ref="tree" :default-expanded-keys="expandedKeys" :data="trees" :props="props" :filter-node-method="filterNode" node-key="orgId" @node-click="nodeClick" :expand-on-click-node="false" :highlight-current="true">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <div class="jc-tree-label">
            <div class="jc-text-warp" v-text="node.label"></div>
          </div>
          <div class="jc-tree-options" v-on:click.stop>
            <!-- <template v-if="node.level > 1">
              <el-button type="text" size="small" icon="el-icon-delete"></el-button>
              <el-button type="text" size="small" icon="el-icon-edit-outline"></el-button>
            </template> -->
            <el-button type="text" size="small" icon="el-icon-circle-plus-outline"></el-button>
            <el-button type="text" size="small" icon="el-icon-view"></el-button>
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>
<script>
import TreesFilterMixins from '@/mixins/TreesFilterMixins'
import { organizationList } from '@/api/organization'

export default {
  name: 'SystemGridManageTrees',
  mixins: [TreesFilterMixins],
  data() {
    return {
      loading: false,
      filterText: '',
      trees: [],
      expandedKeys: [],
      props: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.filter(val)
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
          if (this.trees.length) {
            this.$nextTick(() => {
              this.orgId = this.orgId || this.trees[0].orgId
              this.$refs.tree.setCurrentKey(this.orgId)
              // this.nodeChange({ orgId: this.orgId, type: 'manage' })
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
            label: item.orgName,
            orgName: item.orgName
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
      // this.$emit('node-change', { orgId: data.orgId, type: 'node-click' })
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
    width: 50px;
    padding-top: 2px;
    .el-button {
      padding: 0;
      margin-left: 2px;
      float: right;
    }
  }
}
</style>
