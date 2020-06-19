<template>
  <div class="jc-main-container-warp">

    <div v-show="!detailShow&&!dailyDetailShow">
      <tab-filter :projectList="projectList" @filter="goFilter"></tab-filter>
      <el-card class="jc-table-card jc-mt">
        <div slot="header" class="jc-card-header">
          <div class="jc-card-title">列表内容</div>
          <div class="jc-button-group">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="manageDaily(null)">日常任务</el-button>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="manageTemporary(null)">临时任务</el-button>
          </div>
        </div>
        <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <!-- <el-table-column prop="projectType" label="项目类型"></el-table-column> -->
          <el-table-column prop="projectId" label="项目名称" :formatter="formatProject"></el-table-column>
          <el-table-column prop="taskTypeName" label="任务类型"></el-table-column>
          <el-table-column prop="startUser" label="下发人"></el-table-column>
          <el-table-column prop="startOrg" label="下发组织"></el-table-column>
          <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="taskStatusName" label="任务状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" width="140"></el-table-column>
          <el-table-column width="90" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-view" @click="handle(scope.row,false)" title="查看" v-if="filter.selectType===TASK_SELECT_TYPES.DONE||filter.selectType===TASK_SELECT_TYPES.ISSUED"></el-button>
              <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" v-if="filter.selectType===TASK_SELECT_TYPES.DEAFT" title="编辑"></el-button>
              <el-button type="text" size="mini" icon="el-icon-refresh-right" @click="handle(scope.row,true)" title="处理" v-if="filter.selectType===TASK_SELECT_TYPES.PENDING"></el-button>
              <el-button type="text" size="mini" icon="el-icon-arrow-down" @click="startTask(scope.row)" title="下发" v-if="filter.selectType===TASK_SELECT_TYPES.DEAFT"></el-button>
              <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除" v-if="filter.selectType!==TASK_SELECT_TYPES.PENDING"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
      </el-card>
    </div>

    <jc-detail :orgTree="orgTree" :projectListArr="projectListArr" :orgObj="orgObj" :info="info" :detailShow.sync="detailShow" v-show="detailShow" @save-success="initData"></jc-detail>

    <jc-manage :orgTree="orgTree" :projectList="projectList" :projectListArr="projectListArr" :user="user" :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>

    <jc-manage-daily :orgTree="orgTree" :projectList="projectList" :projectListArr="projectListArr" :orgObj="orgObj" :orgId="orgId" :options="dailyInfo" :visible.sync="visibleDaily" @save-success="initData"></jc-manage-daily>

    <jc-detail-daily :orgTree="orgTree" :projectListArr="projectListArr" :orgObj="orgObj" :info="dailyInfo" :dailyDetailShow.sync="dailyDetailShow" v-show="dailyDetailShow" @save-success="initData"></jc-detail-daily>

  </div>
</template>
<script>
import { taskList, taskDel, taskStart, taskGet, taskUpdStatus, taskGetDaily } from '@/api/task'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
import { projectsList } from '@/api/projects'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

import { TASK_SELECT_TYPES, TASK_STATES, TASK_TYPES, PROJECT_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'TaskProcessIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage'),
    JcDetail: () => import('./modules/detail'),
    JcDetailDaily: () => import('./modules/detailDaily'),
    JcManageDaily: () => import('./modules/manageDaily')
  },
  data() {
    return {
      TASK_SELECT_TYPES,
      orgTree: [],
      orgObj: {},
      list: [],
      loading: false,
      visible: false,
      visibleDaily: false,
      info: null,
      dailyInfo: null,
      filter: {
        selectType: TASK_SELECT_TYPES.PENDING
      },
      orgId: '',
      detailShow: false,
      dailyDetailShow: false,
      projectList: [],
      projectListArr: []
    }
  },
  computed: {
    ...mapState(['user'])
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

      return (project[0] && project[0].label) || PROJECT_TYPES.toString(PROJECT_TYPES.NORMAL)
    },
    async  formatProjectList() {
      this.EmergencySupport = await this.getProjectList(PROJECT_TYPES.EmergencySupport)
      this.SpecialControl = await this.getProjectList(PROJECT_TYPES.SpecialControl)

      // this.projectListArr = [...PROJECT_TYPES.VALUES]
      this.projectListArr = []
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
            id: item.orgId,
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
    del(row) {
      this.$confirm('确认删除该任务', '提示', { type: 'warning' }).then(() => {
        this.remove(row.businessKey)
      }).catch(() => {})
    },
    async remove(id) {
      try {
        await taskDel(id)
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      } catch (error) {
        console.error(error)
      }
    },
    manage(row) {
      if (row.taskType == TASK_TYPES.DAILY) {
        this.manageDaily(row)
      } else if (row.taskType == TASK_TYPES.TEMPORARY) {
        this.manageTemporary(row)
      }
    },
    //添加 编辑  临时任务
    async manageTemporary(row) {
      if (row) {
        const res = await taskGet(row.businessKey)

        this.info = res
      } else {
        this.info = null
      }
      this.orgId = this.user.orgId
      this.visible = true
    },
    //添加 编辑  日常任务
    async manageDaily(row) {
      if (row) {
        const res = await taskGetDaily(row.businessKey)

        this.dailyInfo = res
      } else {
        this.dailyInfo = null
      }
      this.orgId = this.user.orgId
      this.visibleDaily = true
    },
    //下发任务
    startTask(row) {
      this.$confirm('确认下发该任务', '提示', { type: 'warning' }).then(async () => {
        try {
          await taskStart(row.businessKey)
          this.$message.success('下发成功')
          this.initData()
        } catch (e) {
          console.error(e)
        }
      }).catch(() => {})
    },
    //handle   true任务处理  false任务详情
    async handle(row, handle) {
      if (row.taskStatus == TASK_STATES.ISSUED) {
        try {
          await taskUpdStatus(row.businessKey)
        } catch (error) {
          console.error(error)
        }
      }
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
