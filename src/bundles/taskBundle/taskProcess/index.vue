<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <!-- <el-button type="primary" icon="el-icon-plus" size="small" @click="manage(null)">日常任务</el-button> -->
          <el-button type="primary" icon="el-icon-plus" size="small" @click="manage(null)">临时任务</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="projectType" label="项目类型"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column prop="taskTypeName" label="任务类型"></el-table-column>
        <el-table-column prop="startUser" label="下发人"></el-table-column>
        <el-table-column prop="startOrg" label="下发组织"></el-table-column>
        <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="taskStatusName" label="任务状态" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" width="140"></el-table-column>
        <el-table-column width="90" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="manage(scope.row,true)" title="查看" v-if="filter.selectType===TASK_SELECT_TYPES.DONE||filter.selectType===TASK_SELECT_TYPES.ISSUED"></el-button>
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" v-if="filter.selectType===TASK_SELECT_TYPES.DEAFT" title="编辑"></el-button>
            <el-button type="text" size="mini" icon="el-icon-refresh-right" @click="handle(scope.row)" title="处理" v-if="filter.selectType===TASK_SELECT_TYPES.PENDING"></el-button>
            <el-button type="text" size="mini" icon="el-icon-arrow-down" @click="startTask(scope.row)" title="下发" v-if="filter.selectType===TASK_SELECT_TYPES.DEAFT"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除" v-if="filter.selectType!==TASK_SELECT_TYPES.PENDING"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>

    </el-card>
    <jc-manage :orgTree="orgTree" :orgId="orgId" :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import { taskList, taskDel, taskStart, taskGet, taskUpdStatus } from '@/api/task'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

import { TASK_SELECT_TYPES } from '@/constant/Dictionaries'


export default {
  name: 'SystemTaskProcessIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage')
  },
  data() {
    return {
      TASK_SELECT_TYPES,
      orgTree: [],
      orgObj: {},
      list: [],
      loading: false,
      visible: false,
      info: null,
      filter: {
        selectType: TASK_SELECT_TYPES.PENDING
      },
      orgId: ''
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
          // const list = []
          // if (resultList && resultList.length) {
          //   resultList.forEach(item=>{
          //     list.push({
          //     })
          //   })
          // }
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
    //添加 编辑 查看
    async manage(row, view) {
      if (row) {
        const res = await taskGet(row.businessKey)

        this.info = res
        if (view) {
          this.info.view = true
        } else {
          this.info.view = false
        }
      } else {
        this.info = null
      }
      this.orgId = this.user.orgId
      this.visible = true
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
    //任务处理
    async handle(row) {
      // this.info = row
      const res = await taskGet(row.businessKey)

      this.info = res
      this.info.taskId = row.taskId
      this.info.view = true
      this.info.handle = true
      this.visible = true

      if (row.taskStatus === 1) {
        try {
          await taskUpdStatus(row.businessKey)
          // this.initData()
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
