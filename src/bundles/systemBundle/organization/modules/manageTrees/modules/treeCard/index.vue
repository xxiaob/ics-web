<template>
  <div class="jc-tree-card" v-loading="loading">
    <el-tree ref="tree" :default-expanded-keys="expandedKeys" :data="trees" :props="props" :filter-node-method="filterNode" node-key="orgId" @node-click="nodeClick" :expand-on-click-node="false" :highlight-current="true">
      <div class="custom-tree-node" slot-scope="{ node,data }">
        <div class="jc-tree-label">
          <div class="jc-text-warp" v-text="node.label" :title="node.label"></div>
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
import { organizationList, organizationDel, getOrgLogo } from '@/api/organization'

export default {
  name: 'SystemOrganizationManageTreesTreeCard',
  mixins: [TreesFilterMixins],
  inject: ['checkManage', 'nodeChange'],
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
      orgId: '',
      expandedKeys: [],
      pNode: { name: '', pid: '' },
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
          if (this.trees.length) {
            this.$nextTick(() => {
              let pid = this.orgId ? '' : this.trees[0].pid

              this.orgId = this.orgId || this.trees[0].orgId
              this.$refs.tree.setCurrentKey(this.orgId)
              this.expandedKeys = [this.orgId]
              this.nodeChange({ orgId: this.orgId, pid, type: 'manage' })
            })
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    saveSuccess(orgId) {
      this.orgId = orgId
      this.initData()
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
            orgCode: item.orgCode,
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
      this.checkManage(async () => {
        if (type == 1) {
          this.pNode = { name: node.name, pid: node.pid }
          try {
            const { commandScreenLogo, dataScreenLogo, welcomeLogo, homePageLogo } = await getOrgLogo(node.orgId)

            this.info = { orgId: node.orgId, orgName: node.orgName, orgCode: node.orgCode, sameLevelAuth: node.sameLevelAuth, commandScreenLogo, dataScreenLogo, welcomeLogo, homePageLogo }
          } catch (error) {
            console.error(error)
          }
        } else if (type == 2) {
          this.pNode = { name: node.orgName, pid: node.orgId }
          this.info = null
        }
        this.visible = true
      })
    },
    del(node) {
      this.checkManage(() => {
        this.$confirm('确认删除该组织架构', '提示', { type: 'warning' }).then(() => {
          organizationDel(node.orgId).then(() => {
            this.$message.success('删除成功')
            this.orgId = ''
            this.initData()
          })
        }).catch(() => {})
      })
    },
    nodeClick(data) {
      this.$refs.tree.setCurrentKey(this.orgId)
      this.checkManage(() => {
        this.orgId = data.orgId
        this.$refs.tree.setCurrentKey(this.orgId)
        this.nodeChange({ orgId: this.orgId, pid: data.pid, type: 'node-click' })
      })
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
