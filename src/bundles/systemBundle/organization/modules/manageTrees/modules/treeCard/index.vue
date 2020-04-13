<template>
  <div class="jc-tree-card" v-loading="loading">
    <el-tree ref="tree" :data="trees" :props="props" :filter-node-method="filterNode" node-key="orgId" @node-click="nodeClick" :expand-on-click-node="false" :highlight-current="true" :default-expand-all="true">
      <div class="custom-tree-node" slot-scope="{ node,data }">
        <div class="jc-tree-label">
          <div class="jc-text-warp" v-text="node.label"></div>
        </div>
        <div class="jc-tree-options" v-if="edit" v-on:click.stop>
          <template v-if="node.level > 1">
            <el-button type="text" size="small" icon="el-icon-delete" @click="del(data)"></el-button>
            <el-button type="text" size="small" icon="el-icon-edit-outline" @click="manage(data, 1)"></el-button>
          </template>
          <el-button type="text" size="small" icon="el-icon-circle-plus-outline" @click="manage(data, 2)"></el-button>
        </div>
      </div>
    </el-tree>
    <jc-manage :options="info" :pNode="pNode" :visible.sync="visible" @save-success="saveSuccess"></jc-manage>
  </div>
</template>
<script>
import TreesFilterMixins from '@/mixins/TreesFilterMixins'
import { organizationList, organizationDel } from '@/api/organization'

export default {
  name: 'SystemOrganizationManageTreesTreeCard',
  mixins: [TreesFilterMixins],
  components: {
    JcManage: () => import('../manage')
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      trees: [],
      visible: false,
      info: null,
      pNode: { name: '', pid: '' },
      props: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData(orgId) {
      if (!this.loading) {
        this.loading = true
        organizationList().then(res => {
          this.trees = this.formatTree(res)
          if ( this.trees.length) {
            this.$nextTick(() => {
              orgId = orgId || this.trees[0].orgId
              this.$refs.tree.setCurrentKey(orgId)
              this.$emit('node-change', { orgId: orgId, type: 'manage' })
            })
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    saveSuccess(orgId) {
      this.initData(orgId)
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
            orgName: item.orgName,
            sameLevelAuth: item.sameLevelAuth == 0 ? '0' : '1'
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
    manage(node, type) {
      if (type == 1) {
        this.pNode = { name: node.name, pid: node.pid }
        this.info = { orgId: node.orgId, orgName: node.orgName, sameLevelAuth: node.sameLevelAuth }
      } else if (type == 2) {
        this.pNode = { name: node.orgName, pid: node.orgId }
        this.info = null
      }
      this.visible = true
    },
    del(node) {
      this.$confirm('确认删除该组织架构', '提示', { type: 'warning' }).then(() => {
        organizationDel(node.orgId).then(() => {
          this.$message.success('删除成功')
          this.initData()
        })
      }).catch(() => {})
    },
    nodeClick(data) {
      this.$emit('node-change', { orgId: data.orgId, type: 'node-click' })
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
  .jc-tree-label {
    flex: 1;
    width: 0;
    font-size: $jc-font-size-small;
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
