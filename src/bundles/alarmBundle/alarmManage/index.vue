<template>
  <div class="jc-main-container-warp">
    <tab-filter :orgTree="orgTree" @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="eventTitle" label="告警来源"></el-table-column>
        <el-table-column prop="orgId" label="所属组织" :formatter="formatOrg"></el-table-column>
        <el-table-column prop="createTime" label="告警时间" :formatter="formatTime"></el-table-column>
        <el-table-column prop="reportUserName" label="告警地点"></el-table-column>
        <el-table-column prop="reportUserName" label="相关人员"></el-table-column>
        <el-table-column prop="reportUserName" label="告警描述"></el-table-column>
        <el-table-column prop="reportUserName" label="告警状态"></el-table-column>
        <el-table-column width="80" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-chat-dot-round" @click="detail(scope.row)" title="告警"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>


  </div>
</template>
<script>

import { eventManageList, eventManageDel } from '@/api/eventManage'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'AlarmMange',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter')

  },
  data() {
    return {
      orgTree: [],
      orgObj: {},
      list: [],
      loading: false,
      visible: false,
      detailVisible: false,
      info: null,
      detailInfo: null,
      filter: {},
      orgId: ''
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async created() {
    await this.getOrgTree()

    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    formatOrg(row, column, cellValue) {
      return this.orgObj[cellValue]
    },
    formatOrgTree(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = {
            value: item.orgId,
            label: item.orgName
          }

          let children = this.formatOrgTree(item.children)

          if (children && children.length) {
            node.children = children
          }

          trees.push(node)
        })
      }
      return trees
    },
    formatOrgTreeToObj(child) {
      let objs = {}

      if (child && child.length) {
        child.forEach(item => {
          if (item.children && item.children.length) {
            objs = Object.assign(objs, this.formatOrgTreeToObj(item.children))
          }
          objs[item.orgId] = item.orgName
        })
      }
      return objs
    },
    async getOrgTree() {
      const res = await organizationList()

      this.orgTree = this.formatOrgTree(res)
      this.orgObj = this.formatOrgTreeToObj(res)
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await eventManageList({ ...this.filter, ...this.page })

          this.page.total = total
          const list = []

          if (resultList && resultList.length > 0) {
            resultList.forEach(item=>{
              list.push({
                createTime: item.createTime,
                desc: item.desc,
                positionName: item.positionName,
                eventTitle: item.eventTitle,
                eventNumber: item.eventNumber,
                eventType: item.eventType,
                typeName: item.typeName,
                id: item.id,
                orgId: item.orgId,
                reportUser: item.reportUser,
                reportUserName: item.reportUserName
              })
            })
          }
          this.list = list
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },
    goFilter(filter) {
      this.filter = filter
      this.currentChange(1)
    },
    del(row) {
      this.$confirm('确认删除该事件', '提示', { type: 'warning' }).then(() => {
        this.remove(row.id)
      }).catch(() => {})
    },
    remove(id) {
      eventManageDel(id).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
