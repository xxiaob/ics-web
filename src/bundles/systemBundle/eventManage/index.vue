<template>
  <div class="jc-main-container-warp">
    <tab-filter :orgTree="orgTree" @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="manage(null)">事件上报</el-button>
          <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="removeAll">删除</el-button> -->
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" @selection-change="tableSelect">
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="eventType" label="事件类型"></el-table-column>
        <el-table-column prop="reportUser" label="上报人"></el-table-column>
        <el-table-column prop="orgId" label="所属组织"></el-table-column>
        <el-table-column prop="desc" label="事件描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime"></el-table-column>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="manage(scope.row,true)" title="查看"></el-button>
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" title="编辑" :disabled="!!scope.row.state"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除" :disabled="!!scope.row.state"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>

    </el-card>
    <jc-manage :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import { eventManageList, eventManageDel } from '@/api/eventManage'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'

export default {
  name: 'SystemEventManageIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage')
  },
  data() {
    return {
      orgTree: [],
      list: [],
      loading: false,
      visible: false,
      info: null,
      ids: [],
      filter: {}
    }
  },
  async created() {
    await this.getOrgTree()

    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue, index) {
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
    async getOrgTree() {
      const res = await organizationList()

      this.orgTree = this.formatOrgTree(res)
    },
    async initData() {
      // console.log(this.orgTree)
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await eventManageList({ ...this.filter, ...this.page })

          this.page.total = total
          const list = []

          if (resultList && resultList.length > 0) {
            resultList.forEach(item=>{
              list.push({
                afterPhoto: item.afterPhoto,
                audioAddr: item.audioAddr,
                beforePhoto: item.beforePhoto,
                createTime: item.createTime,
                desc: item.desc,
                eventNumber: item.eventNumber,
                eventType: item.eventType,
                id: item.id,
                orgId: item.orgId,
                reportUser: item.reportUser,
                videoAddr: item.videoAddr
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
    tableSelect(selections) {
      let ids = []

      if (selections && selections.length) {
        selections.forEach(item=> {
          ids.push(item.id)
        })
      }
      this.ids = ids
    },
    del(row) {
      this.$confirm('确认删除该事件', '提示', { type: 'warning' }).then(() => {
        this.remove(row.id)
      }).catch(() => {})
    },
    removeAll() {
      if (this.ids.length) {
        this.$confirm('确认删除选中的事件', '提示', { type: 'warning' }).then(() => {
          this.remove(this.ids)
        }).catch(() => {})
      } else {
        this.$message.error('请先选择删除项')
      }
    },
    remove(ids) {
      eventManageDel(ids).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    },
    manage(row, view) {
      if (row) {
        this.info = row
        if (view) {
          this.info.view = true
        } else {
          this.info.view = false
        }
        this.visible = true
      } else {
        this.info = null
        this.visible = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table /deep/ {
  .red {
    color: red;
  }
  .green {
    color: green;
  }
}
</style>
