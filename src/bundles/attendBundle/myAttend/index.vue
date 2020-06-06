<template>
  <div class="jc-main-container-warp">
    <tab-filter :self="true" @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="taskName" label="任务名称"></el-table-column>
        <el-table-column prop="areaName" label="考勤范围"></el-table-column>
        <el-table-column prop="status" label="触岗记录" :formatter="formatStatus"></el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
        <!-- startTime endTime -->
        <el-table-column prop="photoUrl" label="打卡照片">
          <template slot-scope="scope">
            <!-- scope.row.photoUrl -->
            <el-image style="width: 100px; height: 80px" :src="scope.row.photoUrl" :preview-src-list="[scope.row.photoUrl]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="onguardDuration" label="在岗时长(h)"></el-table-column>
        <el-table-column prop="journey" label="在岗里程(km)"></el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
  </div>
</template>
<script>
import { myAttendList } from '@/api/attend'
import PaginationMixins from '@/mixins/PaginationMixins'
import { ATTEND_RANGE_STATUSES } from '@/constant/Dictionaries'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'MyAttendIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('../peopleAttend/modules/tabFilter')
  },
  data() {
    return {
      list: [],
      loading: false,
      filter: {}
    }
  },
  async created() {
    this.initData()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    formatStatus(row, column, cellValue) {
      return ATTEND_RANGE_STATUSES.toString(cellValue.toString())
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await myAttendList({ userId: this.user.userId, ...this.filter, ...this.page })

          this.page.total = total
          this.list = resultList.map(item=>({ ...item, time: `${item.startTime} ~ ${item.endTime}` }))
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },
    goFilter(filter) {
      this.filter = filter
      this.currentChange(1)
    }
  }
}
</script>
