<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="manage(null)">添加</el-button>
          <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="removeAll">删除</el-button> -->
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" @selection-change="tableSelect">
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="groupName" label="群组名称"></el-table-column>
        <el-table-column prop="userIds" label="群组用户" :formatter="formatUser"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime"></el-table-column>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" title="编辑"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>

    </el-card>
    <jc-manage :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import { pttGroupList, pttGroupDel } from '@/api/pttGroup'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'

export default {
  name: 'SystemPttGroupIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage')
  },
  data() {
    return {
      list: [],
      loading: false,
      visible: false,
      info: null,
      ids: [],
      filter: {}
    }
  },
  created() {
    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    formatUser(row, column, cellValue) {
      const users = cellValue.map(item=>item.userName)

      return users.join('、')
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await pttGroupList({ ...this.filter, ...this.page })

          this.page.total = total
          const list = []

          if (resultList && resultList.length > 0) {
            resultList.forEach(item=>{
              const { groupId, createTime, groupName, userIds } = item

              list.push({
                groupId,
                groupName,
                userIds,
                createTime
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
      this.$confirm('确认删除该群组', '提示', { type: 'warning' }).then(() => {
        this.remove(row.groupId)
      }).catch(() => {})
    },
    removeAll() {
      if (this.ids.length) {
        this.$confirm('确认删除选中的群组', '提示', { type: 'warning' }).then(() => {
          this.remove(this.ids)
        }).catch(() => {})
      } else {
        this.$message.error('请先选择删除项')
      }
    },
    remove(ids) {
      pttGroupDel(ids).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    },
    manage(row) {
      this.info = row
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
