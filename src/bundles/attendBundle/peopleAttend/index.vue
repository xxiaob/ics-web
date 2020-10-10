<template>
  <div class="jc-main-container-warp">
    <tab-filter :userId="user.userId" :orgTree="orgTree" @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="time" label="时间" width="140"></el-table-column>
        <el-table-column prop="orgName" label="所属组织"></el-table-column>
        <el-table-column prop="superviseTotalCount" label="巡逻">
          <template slot-scope="scope">
            <span>{{scope.row.onguardDuration}}h</span>,
            <span>{{scope.row.journey}}km</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="onguardDuration" label="巡逻时长(h)"></el-table-column> -->
        <!-- <el-table-column prop="journey" label="巡逻里程(km)"></el-table-column> -->
        <el-table-column prop="inoutCount" label="迟到次数"></el-table-column>
        <el-table-column prop="inoutCount" label="出圈"></el-table-column>
        <el-table-column prop="inoutCount" label="触岗次数"></el-table-column>
        <el-table-column prop="eventReportCount" label="事件上报数"></el-table-column>
        <el-table-column prop="problemFeedbackCount" label="问题反馈数"></el-table-column>
        <el-table-column prop="taskCompleteCount" label="任务完成数"></el-table-column>
        <el-table-column prop="superviseTotalCount" label="督查结果">
          <template slot-scope="scope">
            <span class="jc-abnormal">{{scope.row.superviseNormalCount}}</span>
            <span>/</span>
            <span class="jc-normal">{{scope.row.superviseAbnormalCount}}</span>
            <span>/</span>
            <span>{{scope.row.superviseTotalCount}}</span>
          </template>
        </el-table-column>
        <!-- superviseNormalCount superviseAbnormalCount superviseTotalCount -->
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
  </div>
</template>
<script>
import { userAttendList } from '@/api/attend'
import { ATTEND_PERIODS } from '@/constant/Dictionaries'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'PeopleAttendIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter')
  },
  data() {
    return {
      orgTree: [],
      list: [],
      loading: false,
      filter: {
        type: ATTEND_PERIODS.DAY
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async created() {
    await this.getOrgTree()
    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    formatOrg(row, column, cellValue) {
      return this.orgObj[cellValue]
    },
    formatOrgTree(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = {
            value: item.orgId,
            label: item.orgName
          }

          let children = this.formatOrgTree(item.children)

          if (children && children.length) {
            node.children = children
          }

          trees.push(node)
        })
      }
      return trees
    },
    async getOrgTree() {
      const res = await organizationList()

      this.orgTree = this.formatOrgTree(res)
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await userAttendList({ ...this.filter, ...this.page })

          this.page.total = total
          this.list = resultList
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
<style lang="scss" scoped>
.el-table /deep/ {
  .jc-abnormal {
    color: $jc-color-danger;
  }
  .jc-normal {
    color: $jc-color-success;
  }
}
</style>
