<template>
  <div class="jc-main-container-warp">
    <tab-filter></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" icon="el-icon-plus" size="small">添加</el-button>
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
            <el-button type="text" size="mini">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :hide-on-single-page="true" @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
  </div>
</template>
<script>
import PaginationMixins from '@/mixins/PaginationMixins'

export default {
  name: 'SystemOrganizationIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter')
  },
  data() {
    return {
      list: [],
      loading: false,
      filter: {}
    }
  },
  methods: {
    goFilter(filter) {
      this.filter = filter
      this.currentChange(1)
    }
  }
}
</script>
