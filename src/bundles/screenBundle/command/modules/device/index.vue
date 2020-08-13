<template>
  <view-warp title="组织设备">
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-view-content" v-loading="loading">
      <el-tree ref="tree" :default-expanded-keys="expandedKeys" :data="trees" :props="props" :show-checkbox="true" node-key="id" :filter-node-method="filterNode" @check="checkChange">
        <div class="custom-tree-node" slot-scope="{ node,data}">
          <div class="jc-tree-label no-select" :class="{'jc-user': data.type=='user'}" >
            <div class="jc-text-warp" v-text="node.label"></div>
          </div>
          <div class="jc-tree-options" v-on:click.stop>
            <el-button type="text" size="small" icon="el-icon-map-location"  @click="goLocation(data)" title="定位"></el-button>
            <el-button type="text" size="small" icon="el-icon-view" v-if="data.type=='user'" @click="userDetail(data)" title="详情"></el-button>
          </div>
        </div>
      </el-tree>
    </div>
    <div class="jc-user-warp">
      <div class="jc-user-header">
        已选用户
      </div>
      <div class="jc-user-content">
        <div class="jc-user-item" v-for="(user,index) in users" :key="user.id">
          {{user.name}}
          <i class="el-icon-close" @click="deleteUser(index)"></i>
        </div>
      </div>
      <div class="jc-user-footer">
        <div class="jc-opera-item" @click="clearUsers">清除</div>
        <div class="jc-opera-item">多屏视频</div>
      </div>
    </div>
  </view-warp>
</template>
<script>
import { getOrgUserListByProject } from '@/api/user'
import TreesFilterMixins from '@/mixins/TreesFilterMixins'
// import { VIDEO_INVITE_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'ScreenCommandOrg',
  mixins: [TreesFilterMixins],
  props: ['options', 'project'],
  components: {
    ViewWarp: () => import('../common/viewWarp')
  },
  watch: {
    filterText(val) {
      this.filter(val)
    },
    options() {
      this.initOptionsUsers() //初始化传入的用户
    }
  },
  data() {
    return {
      loading: false,
      users: [],
      filterText: '',
      trees: [],
      expandedKeys: [],
      props: { children: 'children', label: 'label' },
      checkKeys: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      try {
        const orgsAndUsers = await getOrgUserListByProject({ projectId: this.project.projectId })

        this.trees = this.formatUserOrgTrees(orgsAndUsers) // 处理组织和用户
        this.expandedKeys = this.trees.length ? [this.trees[0].id] : [] // 设置第一级默认展开

        this.initOptionsUsers() // 初始传入的用户
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    initOptionsUsers() {
      console.log('deviceInitOptions', this.options)
      if (this.options && this.options.lenght) {
        // 如果传入option有选中
        let checkKeys = this.$refs.tree.getCheckedKeys()

        this.$refs.tree.setCheckedKeys([...checkKeys, ...this.options])
        this.$nextTick(() => {
          this.checkChange() // 去设置用户
        })
      }
    },
    deleteUser(index) {
      this.users.splice(index, 1) // 删除用户
      this.updateTreesChecked() // 更新树结构
    },
    clearUsers() {
      // 清空选中的用户
      this.users = []
      this.updateTreesChecked() // 更新树结构
    },
    updateTreesChecked() {
      // 更新树结构
      let keys = []

      this.users.forEach(item => {
        keys.push(item.id)
      })

      this.$refs.tree.setCheckedKeys(keys)
    },
    checkChange() {
      let selectNodes = this.$refs.tree.getCheckedNodes()

      console.log(selectNodes)
      let users = []

      if (selectNodes && selectNodes.length) {
        selectNodes.forEach(item => {
          if (item.type == 'user') {
            users.push({ id: item.id, name: item.label, pid: item.pid })
          }
        })
      }

      this.users = users
    },
    userDetail(userItem) {
      // 详情
      this.$EventBus.$emit('view-component-change', {
        component: 'DeviceDetail', options: {
          userId: userItem.userId, userName: '设备详情',
          center: userItem.center
        }
      })
    },
    goLocation(data) {
      // 定位
      console.log('screen-org-location-data', data)
      if (data.type == 'user') {
        this.$EventBus.$emit('screen-user-location', { id: data.id }) // 通知网格定位
      } else {
        this.$EventBus.$emit('screen-org-location', { id: data.id }) // 通知组织定位
      }
    },
    formatUserOrgTrees(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = { id: item.orgId, label: item.orgName, pid: item.pid, type: 'org' }

          let nodeChildren = this.formatUserOrgTrees(item.children)

          if (item.userRespDTOList && item.userRespDTOList.length) {
            item.userRespDTOList.forEach(user => {
              nodeChildren.push({ id: user.userId, label: user.userName, pid: user.orgId, type: 'user' })
            })
          }
          trees.push(nodeChildren && nodeChildren.length ? { ...node, children: nodeChildren } : node)
        })
      }
      return trees
    }
  }
}
</script>
