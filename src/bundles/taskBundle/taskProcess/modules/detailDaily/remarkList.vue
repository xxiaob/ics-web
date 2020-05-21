<template>
  <div>
    <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" size="mini">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="userName" label="用户名" width="120"></el-table-column>
      <el-table-column prop="text" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" width="140"></el-table-column>
    </el-table>
    <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
  </div>
</template>

<script>
import { taskListRemark } from '@/api/task'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'

export default {
  name: 'TaskProcessDetailDailyRemark',
  mixins: [PaginationMixins],
  props: {
    taskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      loading: false
    }
  },
  watch: {
    taskId(newValue) {
      if (newValue) {
        this.initData()
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    async initData() {
      if (!this.loading && this.taskId) {
        this.loading = true
        try {
          const { total, resultList } = await taskListRemark({ taskId: this.taskId, ...this.page })

          this.page.total = total
          this.list = resultList
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    }
  }
}
</script>
