<template>
  <div class="jc-main-container-warp" >
   <div v-show="!detailShow">
      <tab-filter @filter="goFilter"></tab-filter>
      <el-card class="jc-table-card jc-mt" >
        <div slot="header" class="jc-card-header">
          <div class="jc-card-title">列表内容</div>
        </div>
        <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
          <el-table-column type="index" :index="indexMethod" label="序号" width="80"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="desc" label="立案描述"></el-table-column>
          <el-table-column prop="userName" label="立案人员"></el-table-column>
          <el-table-column prop="createTime" label="处置时间" :formatter="formatTime"></el-table-column>
          <el-table-column width="60" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
      </el-card>
   </div>

    <jc-detail v-show="detailShow" :info="detailInfo" :detailShow.sync="detailShow" @save-success="initData"></jc-detail>
  </div>
</template>
<script>


import { getCaseList } from '@/api/dregsAlarm'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'


export default {
  name: 'CaseRecordsIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('./modules/detail')
  },
  data() {
    return {
      list: [],
      loading: false,
      info: null,
      detailInfo: null,
      filter: {},
      detailShow: false
    }
  },
  async created() {
    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },

    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          console.log('this.filter', this.filter)

          const { total, resultList } = await getCaseList({ ...this.filter, ...this.page })

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

    detail(row) {
      this.detailInfo = row
      this.detailShow = true
    }
  }
}
</script>

