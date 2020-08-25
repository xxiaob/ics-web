<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>

    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" size="small" @click="manage(null)">新增</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="lawsType" label="法规类型"></el-table-column>
        <el-table-column prop="lawsFileName" label="文件名称"></el-table-column>
        <el-table-column prop="createName" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="140"></el-table-column>
        <el-table-column prop="lawsDesc" label="法规描述"></el-table-column>
        <el-table-column width="90" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" title="查看"></el-button>
            <el-button type="text" size="mini" icon="el-icon-edit-outline" title="编辑"></el-button>
            <el-button type="text" size="mini" icon="el-icon-refresh-right" title="处理"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>

    <jc-manage :visible.sync="visible"></jc-manage>
  </div>
</template>

<script>
import PaginationMixins from '@/mixins/PaginationMixins'
export default {
  name: 'superviseLawsAndRegulations',
  mixins: [PaginationMixins],
  data() {
    return {
      loading: false,
      list: [],
      visible: false,
      info: {}
    }
  },
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage')
  },
  methods: {
    goFilter() {},
    manage() {
      this.visible = true
    }
  }

}
</script>

<style>
</style>
