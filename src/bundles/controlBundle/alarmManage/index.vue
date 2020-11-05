<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="80"></el-table-column>
        <el-table-column prop="source" label="信息来源"></el-table-column>
        <el-table-column prop="remark" label="违建标记"></el-table-column>
        <el-table-column prop="positionName" label="建筑地址"></el-table-column>
        <el-table-column prop="areaCovered" label="占地面积" ></el-table-column>
        <el-table-column prop="createDate" label="处置时间" :formatter="formatTime"></el-table-column>
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

import { getControlList } from '@/api/controlViolate.js'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'


export default {
  name: 'alarmManageIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('./modules/detail')
  },
  data() {
    return {
      list: [],
      loading: false,
      visible: false,
      detailVisible: false,
      info: null,
      detailInfo: null,
      filter: {}

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
          const { total, resultList } = await getControlList({ ...this.filter, ...this.page })

          if (resultList && resultList.length) {
            resultList.forEach(item => {
              item.photos = item.photo && item.photo.split(',')
            })
          }

          this.list = resultList
          this.page.total = total
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
      this.detailVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
