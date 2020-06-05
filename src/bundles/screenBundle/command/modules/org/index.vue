<template>
  <view-warp title="组织架构">
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <el-tree ref="tree" :default-expanded-keys="expandedKeys" :data="trees" :show-checkbox="true" :props="props" :filter-node-method="filterNode" node-key="id">
        <div class="custom-tree-node" slot-scope="{ node,data }">
          <div class="jc-tree-label no-select" :class="{'jc-user': data.type=='user'}">
            <div class="jc-text-warp" v-text="node.label"></div>
          </div>
          <div class="jc-tree-options" v-on:click.stop>
            <el-button type="text" size="small" icon="el-icon-map-location"></el-button>
          </div>
        </div>
      </el-tree>
    </div>
    <div class="jc-user-warp">
      <div class="jc-user-header">
        已选用户
        <span class="jc-talk-type" :class="{'jc-active': talkType == 'video'}" @click="talkType = 'video'">视频</span>
        <span class="jc-talk-type" :class="{'jc-active': talkType == 'audio'}" @click="talkType = 'audio'">音频</span>
      </div>
      <div class="jc-user-content">
        <div class="jc-user-item"></div>
      </div>
    </div>
  </view-warp>
</template>
<script>
import { getOrgUserList } from '@/api/user'
import TreesFilterMixins from '@/mixins/TreesFilterMixins'

export default {
  name: 'ScreenCommandOrg',
  mixins: [TreesFilterMixins],
  props: ['options'],
  components: {
    ViewWarp: () => import('../commont/viewWarp')
  },
  watch: {
    filterText(val) {
      this.filter(val)
    }
  },
  data() {
    return {
      loading: false,
      filterText: '',
      trees: [],
      expandedKeys: [],
      props: { children: 'children', label: 'label' },
      checkKeys: [],
      talkType: 'audio'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      try {
        const orgsAndUsers = await getOrgUserList()

        this.trees = this.formatUserOrgTrees(orgsAndUsers)//处理组织和用户
        this.expandedKeys = this.trees.length ? [this.trees[0].id] : [] //设置第一级默认展开
      } catch (error) {
        console.log(error)
      }
      this.loading = false
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
    }
  }
}
</script>