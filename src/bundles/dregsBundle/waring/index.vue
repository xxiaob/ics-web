<template>
  <div class="jc-main-container-warp">
    <tab-filter :types="types" @filter="goFilter"></tab-filter>

    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="alarmTypeName" width="220" label="告警类型"></el-table-column>
        <el-table-column prop="alarmDesc" label="告警信息"></el-table-column>
        <el-table-column prop="alarmDate" width="300" label="时间"></el-table-column>
        <el-table-column prop="status" width="160" label="状态" show-overflow-tooltip></el-table-column>

      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getByType } from '@/api/supervise'
import { getDregsAlarmList } from '@/api/dregsAlarm'
import { LAWS_TYPES } from '@/constant/Dictionaries'
import PaginationMixins from '@/mixins/PaginationMixins'
export default {
  name: 'dregsWaringIndex',
  mixins: [PaginationMixins],
  data() {
    return {
      loading: false,
      list: [],
      filter: {},
      types: []
    }
  },
  mounted() {
    this.getStatuteTypes()
    this.initData()
  },
  components: {
    TabFilter: () => import('./modules/tabFilter')
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
          const { total, resultList } = await getDregsAlarmList({ ...this.filter, ...this.page })

          console.log('resultList', resultList)

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
      this.types = await getByType({ type: LAWS_TYPES.ALARM }) // 获取告警类型
      console.log('this.type', this.types)
    },
    goFilter(filter) {
      this.filter = filter // 获取查询信息
      this.currentChange(1) // 切换页面方法,在切换页面方法中调用initData初始化数据
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

