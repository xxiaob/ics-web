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

    <jc-detail :orgTree="orgTree" :orgObj="orgObj" :projectListArr="projectListArr" :info="info" :detailShow.sync="detailShow" v-show="detailShow" @save-success="initData"></jc-detail>

    <jc-detail-daily :orgTree="orgTree" :orgObj="orgObj" :projectListArr="projectListArr" :info="dailyInfo" :dailyDetailShow.sync="dailyDetailShow" v-show="dailyDetailShow" @save-success="initData"></jc-detail-daily>

  </div>
</template>
<script>
import { taskList, taskGet, taskGetDaily } from '@/api/task'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
import { projectsList } from '@/api/projects'
import { TASK_TYPES, PROJECT_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'SystemTaskSearchIndex',
  mixins: [PaginationMixins],
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
      dailyDetailShow: false,
      projectList: [],
      projectListArr: []
    }
  },
  async created() {
    await this.getOrgTree()
    await this.formatProjectList()

    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    formatProject(row, column, cellValue) {
      const project = this.projectListArr.filter(item=>item.value == cellValue)

      return (project[0] && project[0].label) || ''
    },
    async formatProjectList() {
      this.EmergencySupport = await this.getProjectList(PROJECT_TYPES.EmergencySupport)
      this.SpecialControl = await this.getProjectList(PROJECT_TYPES.SpecialControl)

      this.projectListArr = [...PROJECT_TYPES.VALUES]
      if (this.EmergencySupport) {
        this.projectListArr = [...this.projectListArr, ...this.EmergencySupport]
      }
      if (this.SpecialControl) {
        this.projectListArr = [...this.projectListArr, ...this.SpecialControl]
      }

      this.projectList = PROJECT_TYPES.VALUES.map(item=>{
        const { value, label, key } = item

        return { value, label, children: this[key] || null }
      })
    },
    async getProjectList(projectType) {
      const res = await projectsList({ projectType })

      if (res && res.length) {
        return res.map(item=>({ value: item.projectId, label: item.projectName }))
      } else {
        return null
      }
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
