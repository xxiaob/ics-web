<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>

    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" size="small" @click="manageTemporary(null)">新增</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="lawsType" label="条例类型"></el-table-column>
        <el-table-column prop="lawsFileName" label="权利编码"></el-table-column>
        <el-table-column prop="createName" label="权利名称常用"></el-table-column>
        <el-table-column prop="createTime" label="设定依据" width="140"></el-table-column>
        <el-table-column width="90" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" title="查看"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import PaginationMixins from '@/mixins/PaginationMixins'
export default {
  name: 'superviseRegulationsInquiry',
  mixins: [PaginationMixins],
  data() {
    return {
      loading: false,
      list: []
    }
  },
  components: {
    TabFilter: () => import('./modules/tabFilter')
  },
  methods: {
    goFilter() {}
  }

}
</script>

<style>
</style>
