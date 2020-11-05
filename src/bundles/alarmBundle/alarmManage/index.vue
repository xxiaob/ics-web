<template>
  <div class="jc-main-container-warp">
    <tab-filter :orgTree="orgTree" @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="alarmSourceName" label="告警来源"></el-table-column>
        <el-table-column prop="orgName" label="所属组织"></el-table-column>
        <el-table-column prop="createTime" label="告警时间" min-width="120" :formatter="formatTime"></el-table-column>
        <el-table-column prop="alarmLocation" label="告警地点"></el-table-column>
        <el-table-column prop="alarmUsers" label="相关人员" width="100"></el-table-column>
        <el-table-column prop="alarmDesc" label="告警描述"></el-table-column>
        <el-table-column prop="enabledName" label="告警状态" width="80"></el-table-column>
        <el-table-column width="80" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-chat-dot-round" @click="send(scope.row, !scope.row.enabled)" :class="{isDisabled:!scope.row.enabled}" title="告警"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
  </div>
</template>
<script>

import { getAlarmList, sendRemind } from '@/api/warning'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'


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
      filter: {}
    }
  },

  async created() {
    await this.getOrgTree()

    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
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
        // 过滤筛选条件的空项
        let filter = {}

        for (let key in this.filter) {
          if (this.filter[key] !== '') {
            filter[key] = this.filter[key]
          }
        }

        try {
          const { total, resultList } = await getAlarmList({ ...filter, ...this.page })

          if (resultList && resultList.length) {
            resultList.forEach(item => {
              item.enabledName = item.enabled ? '开启' : '关闭'
            })
          }

          this.page.total = total
          this.list = resultList
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
    async send(row, isDisabled) {
      // 如果告警已关闭不发送告警提醒
      if (isDisabled) {
        this.$message({
          message: '当前告警已关闭'
        })
        return
      }


      // 如果告警开启发送告警提醒
      this.loading = true
      try {
        await sendRemind(row.id)
        this.loading = false
        this.$message({
          message: '提醒已发送',
          type: 'success'
        })
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.isDisabled{
  color:#ccc;
}
</style>
