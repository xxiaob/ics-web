<template>
  <div class="jc-main-container-warp">
    <tab-filter :types="types" @filter="goFilter"></tab-filter>

    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="statuteTypeName" label="条例类型"></el-table-column>
        <el-table-column prop="statuteName" label="权利编码"></el-table-column>
        <el-table-column prop="userName" label="权利名称常用"></el-table-column>
        <el-table-column prop="statuteDesc" label="设定依据" width="140"></el-table-column>
        <el-table-column width="90" label="操作">
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
// 使用的是法律法规的接口,后期接口出来需要调整
import { getCheckList, getByType } from '@/api/supervise'
import { LAWS_TYPES } from '@/constant/Dictionaries'

import PaginationMixins from '@/mixins/PaginationMixins'
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
          const { total, resultList } = await getCheckList({ ...this.filter, ...this.page })

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
      this.types = await getByType({ type: LAWS_TYPES.STATUTE }) // 获取法规类型
    },
    goFilter(filter) {
      this.filter = filter // 获取查询信息
      this.currentChange(1)
    },
    detail(row) {
      // 查看详情
      this.info = row
      this.detailVisible = true
    }
  }

}
</script>

<style>
</style>
