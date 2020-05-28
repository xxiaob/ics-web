<template>
  <el-dialog :title="'资源设置 | '+options.projectName" :visible.sync="dialogVisible" width="600px" :append-to-body="true" @close="dialogClose">
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <el-tree ref="tree" class="jc-uo-tree" v-loading="treesLoading" :default-expanded-keys="expandedKeys" :data="trees" :show-checkbox="true" :props="props" :filter-node-method="filterNode" node-key="id">
      <div class="custom-tree-node" slot-scope="{ node,data }" :class="{'jc-user': data.type=='user'}">
        <div class="jc-text-warp" v-text="data.label"></div>
      </div>
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getOrgUserList } from '@/api/user'
import { projectUserRefList, projectUserRefSave } from '@/api/projects'
import TreesFilterMixins from '@/mixins/TreesFilterMixins'

export default {
  name: 'ProjectProjectSettingResource',
  props: ['options', 'visible'],
  mixins: [TreesFilterMixins],
  data() {
    return {
      filterText: '',
      dialogVisible: false,
      loading: false,
      treesLoading: '',
      trees: [],
      expandedKeys: [],
      props: { children: 'children', label: 'label' },
      checkKeys: []
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initData()
      }
    },
    filterText(val) {
      this.filter(val)
    }
  },
  methods: {
    async initData() {
      this.trees = []
      this.expandedKeys = []
      this.checkKeys = []
      this.filterText = ''
      this.dialogVisible = this.visible
      this.treesLoading = true
      try {
        const orgsAndUsers = await getOrgUserList()

        this.trees = this.formatUserOrgTrees(orgsAndUsers)//处理组织和用户
        this.expandedKeys = this.trees.length ? [this.trees[0].id] : [] //设置第一级默认展开

        //处理原有用户显示
        const checkUsers = await projectUserRefList({ projectId: this.options.projectId })

        if (checkUsers && checkUsers.length) {
          let checkKeys = []

          checkUsers.forEach(item => {
            checkKeys.push(item.userId)
          })
          this.checkKeys = checkKeys
        }

        this.$refs.tree.setCheckedKeys(this.checkKeys)
      } catch (error) {
        console.log(error)
      }
      this.treesLoading = false
    },
    formatUserOrgTrees(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = { id: item.orgId, label: item.orgName, pid: item.pid, type: 'org' }

          let nodeChildren = this.formatUserOrgTrees(item.children)

          //处理用户 userRespDTOList
          if (item.userRespDTOList && item.userRespDTOList.length) {
            item.userRespDTOList.forEach(user => {
              nodeChildren.push({ id: user.userId, label: user.userName, pid: user.orgId, type: 'user' })
            })
          }
          trees.push(nodeChildren && nodeChildren.length ? { ...node, children: nodeChildren } : node)
        })
      }
      return trees
    },
    async onSubmit() {
      this.loading = true
      let checkNodes = this.$refs.tree.getCheckedNodes(true)

      let checkUsers = []

      checkNodes.forEach(item => {
        if (item.type == 'user') {
          checkUsers.push(item.id)
        }
      })

      console.log('选中的用户id', checkUsers)
      //处理保存参数
      let params = { addUserIds: [], deleteUserIds: [], projectId: this.options.projectId }

      if (this.checkKeys.length) {
        if (checkUsers.length) {
          this.checkKeys.forEach(id => {
            let index = checkUsers.indexOf(id)

            if (index < 0) {
              params.deleteUserIds.push(id)
            } else {
              checkUsers.splice(index, 1)
            }
          })
          params.addUserIds = checkUsers
        } else {
          params.deleteUserIds = this.checkKeys
        }
      } else {
        params.addUserIds = checkUsers
      }
      console.log('提交用户更新', this.checkKeys, params)
      try {
        await projectUserRefSave(params)
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.$emit('save-success')
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    dialogClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-uo-tree {
  position: relative;
  height: 360px;
  overflow-y: auto;
  margin-top: $jc-default-dis/2;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  width: 0;
  font-size: $jc-font-size-small;
  padding-left: 15px;
  background: url(/static/areaicons/organization.png) no-repeat left center;
  background-size: 12px auto;
  &.jc-user {
    background-image: url(./assets/user.png);
  }
}
</style>
