<template>
  <div class="jc-main-container-warp">
    <tab-filter :orgTree="orgTree" @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="createTime" label="时间" :formatter="formatTime" width="140"></el-table-column>
        <el-table-column prop="orgName" label="所属组织"></el-table-column>
        <el-table-column prop="orgName" label="岗点名称"></el-table-column>
        <el-table-column prop="orgName" label="在岗时长(h)"></el-table-column>
        <el-table-column prop="orgName" label="在岗里程(h)"></el-table-column>
        <el-table-column prop="orgName" label="触岗次数"></el-table-column>
        <el-table-column prop="orgName" label="事件上报数"></el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
  </div>
</template>
<script>
import { questionList } from '@/api/question'
import { ATTEND_PERIODS } from '@/constant/Dictionaries'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
// import { createNamespacedHelpers } from 'vuex'
// const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'MyAttendIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('../peopleAttend/modules/tabFilter')
  },
  data() {
    return {
      orgTree: [],
      list: [],
      loading: false,
      filter: {
        selectType: ATTEND_PERIODS.DAY
      }
    }
  },
  // computed: {
  //   ...mapState(['user'])
  // },
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
          const { total, resultList } = await questionList({ ...this.filter, ...this.page })

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