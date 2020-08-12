<template>
  <div class="jc-main-container-warp">

    <div v-show="!detailShow&&!dailyDetailShow">
      <tab-filter :orgTree="orgTree" :projectList="projectList" @filter="goFilter"></tab-filter>
      <el-card class="jc-table-card jc-mt">
        <div slot="header" class="jc-card-header">
          <div class="jc-card-title">列表内容</div>
        </div>
        <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
          <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
          <!-- <el-table-column prop="projectType" label="项目类型"></el-table-column> -->
          <el-table-column prop="projectId" label="项目名称" :formatter="formatProject"></el-table-column>
          <el-table-column prop="taskTypeName" label="任务类型"></el-table-column>
          <el-table-column prop="startUser" label="下发人"></el-table-column>
          <el-table-column prop="startOrg" label="下发组织"></el-table-column>
          <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="taskStatusName" label="任务状态" show-overflow-tooltip></el-table-column>
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

    <jc-detail :orgTree="orgTree" :orgObj="orgObj" :info="info" :detailShow.sync="detailShow" v-show="detailShow" @save-success="initData"></jc-detail>

    <jc-detail-daily :orgTree="orgTree" :orgObj="orgObj" :info="dailyInfo" :dailyDetailShow.sync="dailyDetailShow" v-show="dailyDetailShow" @save-success="initData"></jc-detail-daily>

  </div>
</template>
<script>
import { taskList, taskGet, taskGetDaily } from '@/api/task'
import { organizationList } from '@/api/organization'
import { projectsTreeList } from '@/api/projects'

import PaginationMixins from '@/mixins/PaginationMixins'
import projectsMixins from '@/bundles/taskBundle/mixins/projectsMixins'

import { TASK_TYPES } from '@/constant/Dictionaries'
import { formatDate } from '@/libs/util'

export default {
  name: 'TaskSearchIndex',
  mixins: [PaginationMixins, projectsMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('../taskProcess/modules/detail'),
    JcDetailDaily: () => import('../taskProcess/modules/detailDaily')
  },
  data() {
    return {
      orgTree: [],
      orgObj: {},
      list: [],
      loading: false,
      info: null,
      dailyInfo: null,
      filter: {},
      orgId: '',
      detailShow: false,
      dailyDetailShow: false
    }
  },
  async created() {
    await this.getOrgTree()
    await this.getProjects()
    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
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
    formatOrgTreeToObj(child) {
      let objs = {}

      if (child && child.length) {
        child.forEach(item => {
          if (item.children && item.children.length) {
            objs = Object.assign(objs, this.formatOrgTreeToObj(item.children))
          }
          objs[item.orgId] = item.orgName
        })
      }
      return objs
    },
    async getOrgTree() {
      const res = await organizationList()

      this.orgTree = this.formatOrgTree(res)
      this.orgObj = this.formatOrgTreeToObj(res)
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await taskList({ ...this.filter, ...this.page })

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
    //handle   true任务处理  false任务详情
    async handle(row, handle) {
      if (row.taskType == TASK_TYPES.DAILY) {
        const res = await taskGetDaily(row.businessKey)

        this.dailyInfo = { ...row, ...res }
        this.dailyInfo.handle = handle
        this.dailyDetailShow = true
      } else if (row.taskType == TASK_TYPES.TEMPORARY) {
        const res = await taskGet(row.businessKey)

        this.info = { ...row, ...res }
        this.info.handle = handle
        this.detailShow = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
