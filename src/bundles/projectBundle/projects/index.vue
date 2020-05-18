<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-mt">
      <el-row>
        <el-col :span="6">12</el-col>
        <el-col :span="6">12</el-col>
        <el-col :span="6">12</el-col>
        <el-col :span="6">12</el-col>
      </el-row>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
    <jc-manage :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import PaginationMixins from '@/mixins/PaginationMixins'
import { PROJECT_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'ProjectProjects',
  mixins: [PaginationMixins],
  props: ['projectType'],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage')
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

    },
    goFilter(filter) {
      this.filter = { ...filter }
      this.currentChange(1)
    },
    del(row) {
      this.$confirm('确认删除该区域类型', '提示', { type: 'warning' }).then(() => {
      //  areaTypeDel(ids).then(() => {
      //   this.$message.success('删除成功')
      //   this.currentChange(this.page.pageNum - 1)
      // })
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
