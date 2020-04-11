<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" icon="el-icon-plus" size="small">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="cardId">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="cardNo" label="卡序列号"></el-table-column>
        <el-table-column prop="cardType" label="卡片类型"></el-table-column>
        <el-table-column prop="holderName" label="用户信息"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="issuedTime" label="开卡时间"></el-table-column>
        <el-table-column prop="cardStatus" label="卡片状态"></el-table-column>
        <el-table-column width="120" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini">编辑</el-button>
            <el-button type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :hide-on-single-page="true" @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
  </div>
</template>
<script>
import PaginationMixins from '@/mixins/PaginationMixins'
import { positionList, positionDel } from '@/api/position'

export default {
  name: 'SystemPositionIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter')
  },
  data() {
    return {
      list: [],
      loading: false,
      visible: false,
      info: null,
      filter: {}
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (!this.loading) {
        this.loading = true
        positionList({ ...this.filter, ...this.page }).then(res => {
          this.list = this.formatTree(res)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    goFilter(filter) {
      this.filter = { ...filter }
      this.currentChange(1)
    },
    del(row) {
      this.$confirm('确认删除该菜单', '提示', { type: 'warning' }).then(() => {
        positionDel(row.resId).then(() => {
          this.$message.success('删除成功')
          this.initData()
        })
      }).catch(() => {})
    },
    manage(row) {
      if (row) {
        this.info = row
        this.visible = true
      } else {
        this.info = null
        this.visible = true
      }
    }
  }
}
</script>
