<template>
  <div class="jc-main-container-warp">
    <video-filter @filter="goFilter" :detail="detail">
      <template v-slot:back>
        <el-button icon="el-icon-back" size="small" @click="back" style="margin-right:20px">返回</el-button>
      </template>
    </video-filter>
    <el-card class="jc-table-card jc-mt">
      <div></div>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt" :page-sizes="[12, 24, 36]"></el-pagination>
    </el-card>
  </div>
</template>
<script>
import PaginationMixins from '@/mixins/PaginationMixins'

export default {
  name: 'SystemDeviceLawVideo',
  props: {
    detail: {
      type: Object,
      default: ()=>{}
    }
  },
  mixins: [PaginationMixins],
  data() {
    return {
      loading: false,
      filter: {},
      list: []
    }
  },
  components: {
    VideoFilter: () => import('../videoFilter')
  },
  watch: {
    detail: {
      immediate: true,
      deep: true,
      handler() {
        this.initData()
      }
    }
  },
  created() {
    this.page.pageSize = 12
  },
  methods: {
    initData() {
      if (this.page.pageSize === 10) {
        this.page.pageSize = 12
      }
      if (this.detail && this.detail.id) {
        console.log('initData', this.detail.id)
      }
    },
    goFilter(filter) {
      this.filter = filter
      this.currentChange()
    },
    back() {
      this.$parent.checkShow('index')
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-table-card /deep/ .el-card__body {
  padding: 20px;
  text-align: center;
}
</style>
