<template>
  <view-warp title="组织架构">
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <el-tree ref="tree" :default-expanded-keys="expandedKeys" :data="trees" :show-checkbox="true" :props="props" @check="checkChange" :filter-node-method="filterNode" node-key="id">
        <div class="custom-tree-node" slot-scope="{ node,data }">
          <div class="jc-tree-label no-select jc-flex-warp" :class="{'jc-user': data.type=='user','jc-users-offline': data.type=='user' && !data.online}">
            <i class="iconfont" :class="{'iconrenyuan-5': data.type=='user','online':data.online }"></i>
            <div class="jc-text-warp" v-text="node.label" :title="node.label"></div>
          </div>
          <div class="jc-tree-options" v-on:click.stop>
            <el-button type="text" size="small" icon="el-icon-map-location" :class="{'jc-users-offline': data.type=='user' && !data.online}" @click="goLocation(data)" title="定位"></el-button>
            <el-button type="text" size="small" icon="el-icon-view" :class="{'jc-users-offline': data.type=='user' && !data.online}" v-if="data.type=='user'" @click="userDetail(data)" title="详情"></el-button>
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
let lastOrgIndex = 0


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
    },
    userOnlineData() {
      this.onlineChange() // 监听在线人员列表
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
      checkKeys: [],
      userOnlineData: [] // 在线用户列表
    }
  },
  created() {
    this.initData()
    this.$EventBus.$on('map-user-online-change', this.getUserOnline ) // 推送用户在线/离线数据
  },

  methods: {
    getUserOnline(userOnline) {
      // 对于获取在线人员数据处理
      let userOnlineData = this.userOnlineData

      userOnline.forEach(item => {
        if (item.status) {
          // 用户在线推送
          let index = userOnlineData.findIndex(userId => userId == item.userId)

          // 如果在线人员列表里不存在在线人员id,就加入
          if (index < 0) {
            userOnlineData.push(item.userId)
          }
        } else {
          // 用户离线推送
          let index = userOnlineData.findIndex(userId => userId == item.userId)

          // 如果在线人员列表里存在离线人员id,就删除
          if (index > -1) {
            userOnlineData.splice(index, 1)
          }
        }
      })
      this.userOnlineData = userOnlineData

      // 执行在线人员以及排序方法
      this.onlineChange(this.trees)
    },
    onlineChange(trees) {
      // 处理离线/在线切换的方法

      if (!trees) {
        return
      }

      for (let i = 0; i < trees.length; i++) {
        let treesItem = trees[i]


        if (treesItem.type == 'org') {
          lastOrgIndex = i
          this.onlineChange(treesItem.children || []) // 递归调用处理在线离线设备方法
        } else {
          let isOnline = this.userOnlineData.includes(treesItem.id) // 判断是否在线

          treesItem.online = isOnline
          treesItem.disabled = !isOnline


          // 如果人员在线,并且不是在人员第一位,在改变位置,如果第一位在线,只改变状态
          if (isOnline && (lastOrgIndex + 1 != i) && (lastOrgIndex != i)) {
            this.$refs.tree.remove(treesItem)
            this.$refs.tree.insertAfter(treesItem, trees[lastOrgIndex])
          }
        }
      }
    },
    async initData() {
      // 初始化数据
      this.loading = true
      try {
        // 获取用户列表数据
        const orgsAndUsers = await getOrgUserListByProject({ projectId: this.project.projectId })

        console.log('组织架构orgsAndUsers', orgsAndUsers )

        this.trees = this.formatUserOrgTrees(orgsAndUsers)//处理组织和用户
        this.expandedKeys = this.trees.length ? [this.trees[0].id] : [] //设置第一级默认展开


        this.initOptionsUsers() //初始化传入的用户

        // 用户列表初始获取在线人员数据
        this.$nextTick(() => {
          this.$EventBus.$emit('screen-user-online-obtain', this.getUserOnline)
        })
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
              nodeChildren.push({ id: user.userId, label: user.userName, pid: user.orgId, type: 'user', online: false, disabled: true })
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
      this.$EventBus.$emit('view-component-change', { component: 'UserDetail', options: { userId: userItem.id, userName: userItem.label, online: userItem.online } }) //通知窗口改变
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
