<template>
  <div class="jc-main-container-warp">
    <tab-filter :types="types" @filter="goFilter"></tab-filter>

    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" :cell-style="cellStyle">
        <el-table-column type="index" :index="indexMethod" label="序号" width="80"></el-table-column>
        <el-table-column prop="powerType" width="140" label="条例类型" :formatter="formatterPowser"></el-table-column>
        <el-table-column prop="powerEncode" width="160" label="权力编码"></el-table-column>
        <el-table-column prop="powerName" width="160" label="权力名称常用">
          <template slot-scope="scope">
            <span class="powerName" v-text="scope.row.powerName" :title="scope.row.powerName"></span>
          </template>
        </el-table-column>
        <el-table-column prop="powerGist" label="设定依据">
          <template slot-scope="scope">
            <span class="powerGist" v-text="scope.row.powerGist" :title="scope.row.powerGist"></span>
          </template>
        </el-table-column>
        <el-table-column width="80" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>

    <!-- 详情 -->
    <jc-regulation-detail :info="info" :visible.sync="detailVisible"></jc-regulation-detail>
  </div>
</template>

<script>
import { getByType, getPowerList } from '@/api/supervise'
import { LAWS_TYPES } from '@/constant/Dictionaries'

import PaginationMixins from '@/mixins/PaginationMixins'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'superviseRegulationsInquiry',
  mixins: [PaginationMixins],
  data() {
    return {
      loading: false,
      list: [],
      filter: {},
      info: null,
      visible: false,
      detailVisible: false,
      types: []
    }
  },
  mounted() {
    this.getStatuteTypes()
    this.initData()
  },
  computed: {
    ...mapState(['user'])
  },
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcRegulationDetail: () => import('./modules/detail')
  },
  methods: {
    async initData() {
      // 初始获取数据
      if (!this.loading) {
        this.loading = true
        try {
          let filter = this.filter

          Object.keys(filter).map(key => {
            if (!filter[key]) {
              delete filter[key]
            }
          })
          filter.orgId = this.user.orgId
          const { total, resultList } = await getPowerList({ ...this.filter, ...this.page, type: 1 })

          this.page.total = total
          this.list = resultList
          this.loading = false

          // 请求数据
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },
    async getStatuteTypes() {
      // 获取类型
      this.types = await getByType({ type: LAWS_TYPES.POWER }) // 获取条例类型
    },
    formatterPowser(row, column, cellValue) {
      // 格式化类型
      let types = this.types

      let index = types.findIndex(type => type.configValue == cellValue)

      return types[index].configName
    },
    goFilter(filter) {
      this.filter = filter // 获取查询信息
      this.currentChange(1)
    },
    detail(row) {
      // 查看详情
      this.info = row
      this.detailVisible = true
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      // console.log( row, column, rowIndex, columnIndex)
      // 调整列样式
      if (columnIndex == 3) {
        return 'padding-right:16px;'
      }
      if (columnIndex == 4) {
        return 'padding-right:20px;'
      }

      return ''
    }
  }

}
</script>

<style lang="scss" scoped>
.jc-table {
  .powerGist {
    @include jc-text-warp(10);
    width: 100%;
  }
  .powerName {
    @include jc-text-warp(4);
    width: 100%;
  }
}
</style>

