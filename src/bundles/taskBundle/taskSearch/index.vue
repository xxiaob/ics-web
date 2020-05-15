<template>
  <div class="jc-main-container-warp">
    <tab-filter :orgTree="orgTree" @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="projectType" label="项目类型"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column prop="taskType" label="任务类型"></el-table-column>
        <el-table-column prop="startUser" label="下发人"></el-table-column>
        <el-table-column prop="startOrg" label="下发组织"></el-table-column>
        <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="taskStatus" label="任务状态" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" width="140"></el-table-column>
        <el-table-column width="50" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="manage(scope.row,true)" title="查看"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>

    </el-card>
    <jc-manage :orgTree="orgTree" :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import { taskList, taskGet } from '@/api/task'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
export default {
  name: 'SystemTaskProcessIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('../taskProcess/modules/manage')
  },
  data() {
    return {
      orgTree: [],
      orgObj: {},
      list: [],
      loading: false,
      visible: false,
      info: null,
      filter: {},
      orgId: ''
    }
  },
  async created() {
    await this.getOrgTree()

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
    async getOrgTree() {
      const res = await organizationList()

      this.orgTree = this.formatOrgTree(res)
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
    //添加 编辑 查看
    async manage(row, view) {
      if (row) {
        const res = await taskGet(row.businessKey)

        console.log(res)
        this.info = row
        if (view) {
          this.info.view = true
        } else {
          this.info.view = false
        }
      } else {
        this.info = null
      }
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
