<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>

    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="thirdPartyName" label="告警类型"></el-table-column>
        <el-table-column prop="orgName" label="企业"></el-table-column>
        <el-table-column prop="endTime" label="车牌号"></el-table-column>
        <el-table-column prop="endTime" label="时间"></el-table-column>
        <el-table-column prop="endTime" label="车速"></el-table-column>
        <el-table-column prop="appKey" label="状态" show-overflow-tooltip></el-table-column>

      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import PaginationMixins from '@/mixins/PaginationMixins'
export default {
  name: 'dregsWaringIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter')
  },
  methods: {
    goFilter(filter) {
      this.filter = filter // 获取查询信息
      this.currentChange(1) // 切换页面方法,在切换页面方法中调用initData初始化数据
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

