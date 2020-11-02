<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="desc" label="立案描述"></el-table-column>
        <el-table-column prop="user" label="立案人员"></el-table-column>
        <el-table-column prop="createTime" label="处置时间" :formatter="formatTime"></el-table-column>
        <el-table-column width="60" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>

    <jc-detail :info="detailInfo" :visible.sync="detailVisible"></jc-detail>

  </div>
</template>
<script>
// import { eventManageList, eventManageDel, eventManageGet } from '@/api/eventManage'
import { eventManageDel } from '@/api/eventManage'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'CaseRecordsIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('./modules/detail')
  },
  data() {
    return {
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
    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    formatOrg(row, column, cellValue) {
      return this.orgObj[cellValue]
    },

    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          console.log('this.filter', this.filter)
          // const { total, resultList } = await eventManageList({ systemModuleType: 1, ...this.filter, ...this.page })

          // this.page.total = total
          let resultList = new Array(5).fill(null)
          const list = []

          if (resultList && resultList.length > 0) {
            resultList.forEach(()=>{
              list.push({
                createTime: '2020-07-04 18:31:32',
                title: '立案标题',
                desc: '立案描述',
                user: '立案人员'
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
    },
    detail(row) {
      this.detailInfo = row
      this.detailVisible = true
      // try {
      //   this.detailInfo = await eventManageGet(row.id)
      //   this.detailVisible = true
      // } catch (error) {
      //   console.error(error)
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
