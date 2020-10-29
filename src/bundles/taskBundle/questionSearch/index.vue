<template>
  <div class="jc-main-container-warp">

    <div v-show="!detailShow">
      <tab-filter :types="types" :orgTree="orgTree" @filter="goFilter"></tab-filter>
      <el-card class="jc-table-card jc-mt">
        <div slot="header" class="jc-card-header">
          <div class="jc-card-title">列表内容</div>
        </div>
        <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
          <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
          <el-table-column prop="problemType" label="问题类型" :formatter="formatType"></el-table-column>
          <el-table-column prop="problemSource" label="问题来源" :formatter="formatSource"></el-table-column>
          <el-table-column prop="userName" label="反馈人"></el-table-column>
          <el-table-column prop="orgName" label="所属组织"></el-table-column>
          <el-table-column prop="problemTitle" label="标题"></el-table-column>
          <el-table-column prop="statusName" label="状态"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" width="140"></el-table-column>
          <el-table-column width="50" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-view" @click="handle(scope.row,false)" title="查看"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
      </el-card>
    </div>

    <jc-detail v-show="detailShow" :types="types" :info="info" :firstOrgIds="firstOrgIds" :detailShow.sync="detailShow" @save-success="initData"></jc-detail>

  </div>
</template>
<script>
import { questionList, questionGet, questionTypeList } from '@/api/question'
import { QUESTION_SOURCES } from '@/constant/Dictionaries'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'

export default {
  name: 'TaskQuestionProcessIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('../questionProcess/modules/detail')
  },
  data() {
    return {
      types: [],
      orgTree: [],
      list: [],
      loading: false,
      visible: false,
      info: null,
      filter: {},
      firstOrgIds: [],
      detailShow: false
    }
  },
  async created() {
    await this.getOrgTree()
    this.types = await questionTypeList() || []
    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    formatType(row, column, cellValue) {
      const type = this.types.filter(item=>item.id == cellValue)

      return (type[0] && type[0].typeName) || ''
    },
    formatSource(row, column, cellValue) {
      return QUESTION_SOURCES.toString(cellValue + '')
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
    },
    //handle   true处理问题  false 查看问题
    async handle(row, handle) {
      this.info = await questionGet(row.businessKey)
      this.info.taskId = row.taskId
      this.info.handle = handle
      this.detailShow = true
    }
  }
}
</script>
