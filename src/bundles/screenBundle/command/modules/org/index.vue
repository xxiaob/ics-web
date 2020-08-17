<template>
  <view-warp title="组织架构">
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <el-tree ref="tree" :default-expanded-keys="expandedKeys" :data="trees" :show-checkbox="true" :props="props" @check="checkChange" :filter-node-method="filterNode" node-key="id">
        <div class="custom-tree-node" slot-scope="{ node,data }">
          <div class="jc-tree-label no-select jc-flex-warp" :class="{'jc-user': data.type=='user'}">
            <i class="iconfont online" :class="{'iconrenyuan-5': data.type=='user'}"></i>
            <div class="jc-text-warp" v-text="node.label" :title="node.label"></div>
          </div>
          <div class="jc-tree-options" v-on:click.stop>
            <el-button type="text" size="small" icon="el-icon-map-location" @click="goLocation(data)" title="定位"></el-button>
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
        <div class="jc-user-item" v-for="(user,index) in users" :key="user.id">{{user.name}}<i class="el-icon-close" @click="deleteUser(index)"></i></div>
      </div>
      <div class="jc-user-footer">
        <div class="jc-opera-item" @click="clearUsers">清除</div>
        <div class="jc-opera-item " @click="goMeeting('audio')">音频指挥</div>
        <div class="jc-opera-item" @click="goMeeting('video')">视频指挥</div>
      </div>
    </div>
  </view-warp>
</template>
<script>
import { getOrgUserListByProject } from '@/api/user'
import TreesFilterMixins from '@/mixins/TreesFilterMixins'
import { VIDEO_INVITE_TYPES } from '@/constant/Dictionaries'

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

        this.trees = this.formatUserOrgTrees(orgsAndUsers)//处理组织和用户
        this.expandedKeys = this.trees.length ? [this.trees[0].id] : [] //设置第一级默认展开

        this.initOptionsUsers() //初始化传入的用户
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    deleteUser(index) {
      this.users.splice(index, 1)//删除用户
      this.updateTreesChecked() //更新树结构
    },
    clearUsers() {
      this.users = [] //清除用户
      this.updateTreesChecked() //更新树结构
    },
    initOptionsUsers() {
      if (this.options && this.options.length) {
        let checkKeys = this.$refs.tree.getCheckedKeys()

        this.$refs.tree.setCheckedKeys([...checkKeys, ...this.options])
        this.$nextTick(() => {
          this.checkChange() //去设置用户
        })
      }
    },
    updateTreesChecked() {
      //更新树结构
      let keys = []

      this.users.forEach(item => {
        keys.push(item.id)
      })
      this.$refs.tree.setCheckedKeys(keys)
    },
    checkChange() {
      let selectNodes = this.$refs.tree.getCheckedNodes()

      console.log('选中的', selectNodes)
      let users = []

      if (selectNodes && selectNodes.length) {
        selectNodes.forEach(item=> {
          if (item.type == 'user') {
            users.push({ id: item.id, name: item.label, pid: item.pid })
          }
        })
      }
      this.users = users
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
    goLocation(data) {
      //去定位
      console.log('screen-org-location-data', data)
      if (data.type == 'user') {
        this.$EventBus.$emit('screen-user-location', { id: data.id }) //通知网格定位
      } else if (data.type == 'org') {
        this.$EventBus.$emit('screen-org-location', { id: data.id }) //通知组织定位
      }
    },
    userDetail(userItem) {
      //显示用户详情
      this.$EventBus.$emit('view-component-change', { component: 'UserDetail', options: { userId: userItem.id, userName: userItem.label } }) //通知窗口改变
    },
    goMeeting(talkType) {
      //去进行会议
      if (this.users.length) {
        if (this.users.length > 17) {
          this.$message.error('最多支持17人')
        } else {
          this.$EventBus.$emit('screen-opera-control', { type: 'select', isSelect: false })
          this.$EventBus.$emit('screen-media-live', { users: this.users, type: talkType == 'video' ? VIDEO_INVITE_TYPES.MEETVIDEO : VIDEO_INVITE_TYPES.MEETAUDIO })
          this.clearUsers() //清空用户
        }
      } else {
        this.$message.error('请选择人员')
      }
    }
  }
}
</script>
