<template>
  <div class="jc-main-container-warp">
    <tab-filter :userId="user.userId" :orgTree="orgTree" @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
        <el-table-column prop="orgName" label="所属组织"></el-table-column>
        <el-table-column prop="postName" label="岗点名称"></el-table-column>
        <el-table-column prop="taskName" label="任务名称"></el-table-column>
        <el-table-column prop="taskTime" label="任务时间" width="150"></el-table-column>
        <el-table-column prop="onguardDuration" label="在岗时长(h)"></el-table-column>
        <el-table-column prop="journey" label="在岗里程(km)"></el-table-column>
        <el-table-column prop="inoutCount" label="触岗次数"></el-table-column>
        <el-table-column prop="eventReportCount" label="事件上报数"></el-table-column>
        <el-table-column prop="postAssess" label="岗点考核"></el-table-column>
        <el-table-column width="80" label="督查操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-video-camera" @click="manage(scope.row,1)" title="强制观摩"></el-button>
            <el-button type="text" size="mini" icon="el-icon-phone" @click="manage(scope.row,0)" title="语音通话"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="superviseUserName" label="督查人"></el-table-column>
        <el-table-column prop="superviseStatus" label="督查结果" :formatter="formatResult"></el-table-column>
        <el-table-column prop="superviseDesc" label="备注"></el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>

    <jc-manage :user="user" title="岗点督查" :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>

  </div>
</template>
<script>
import { postOverseeList } from '@/api/attend'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
import { POST_OVERSEE_RESULTS } from '@/constant/Dictionaries'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'PostOverseeIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage')
  },
  data() {
    return {
      orgTree: [],
      list: [],
      loading: false,
      filter: {},
      visible: false,
      info: null
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
    formatResult(row, column, cellValue) {
      if (cellValue) {
        return POST_OVERSEE_RESULTS.toString(cellValue.toString())
      } else {
        return ''
      }
    },
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
          const { total, resultList } = await postOverseeList({ ...this.filter, ...this.page })

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
    },
    manage(row, overseeType) {
      this.info = row
      this.info.overseeType = overseeType
      this.visible = true
    }
  }
}
</script>
