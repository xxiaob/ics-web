<template>
  <div class="jc-projects-warp">
    <div class="jc-main-container-warp">
      <tab-filter @filter="goFilter"></tab-filter>
      <el-card class="jc-mt" v-loading="loading">
        <el-row>
          <el-col :span="6">
            <div class="jc-project-item">
              <div class="jc-item-add" @click="manage(null)">添加</div>
            </div>
          </el-col>
          <el-col :span="6" v-for="item in list" :key="item.projectId">
            <list-item :projectType="projectType" :item="item" @manage="manage(item)" @opera-change="operaChange"></list-item>
          </el-col>
        </el-row>
        <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
      </el-card>
    </div>
    <jc-manage :options="info" :projectType="projectType" :visible.sync="visible" @save-success="initData"></jc-manage>
    <grid-setting :options="opreaData" :visible.sync="gridVisible"></grid-setting>
    <resource-setting :options="opreaData" :visible.sync="resourceVisible"></resource-setting>
    <statistics :options="opreaData" :visible.sync="statisticsVisible"></statistics>
    <task-daily-manage :projectId="opreaData.projectId" :visible.sync="taskDailyVisible"></task-daily-manage>
  </div>
</template>
<script>
import PaginationMixins from '@/mixins/PaginationMixins'
import { projectsListByPage } from '@/api/projects'

export default {
  name: 'ProjectProjects',
  mixins: [PaginationMixins],
  props: ['projectType'],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage'),
    ListItem: () => import('./modules/listItem'),
    Statistics: () => import('./modules/statistics'),
    GridSetting: () => import('../projectSetting/grid'),
    ResourceSetting: () => import('../projectSetting/resource'),
    TaskDailyManage: () => import('@/bundles/taskBundle/taskProcess/modules/manageDaily')
  },
  data() {
    return {
      list: [],
      loading: false,
      visible: false,
      info: null,
      opreaData: { projectName: '--' },
      gridVisible: false,
      resourceVisible: false,
      taskDailyVisible: false,
      statisticsVisible: false,
      filter: {}
    }
  },
  watch: {
    '$route'() {
      this.gridVisible = false
      this.goFilter({})
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      if (this.loading) {
        return false
      }
      this.loading = true
      try {
        const { total, resultList } = await projectsListByPage({ projectType: this.projectType, ...this.filter })

        this.page.total = total
        // let list = []

        // if (resultList && resultList.length) {
        //   resultList.forEach(item => {
        //     list.push({ projectId: item.projectId, projectName: item.projectName, projectType: item.projectType, beginTime: item.beginTime, endTime: item.endTime, orgId: item.orgId, orgName: item.orgName, description: item.description })
        //   })
        // }
        this.list = resultList
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    goFilter(filter) {
      this.filter = { ...filter }
      this.currentChange(1)
    },
    operaChange(options) {
      this.opreaData = options.data
      if (options.opera == 'start-stop-project') {
        this.initData()
      } else if (options.opera == 'delete-success') {
        this.currentChange(this.page.pageNum - 1)
      } else if (options.opera == 'grid-setting') {
        this.gridVisible = true
      } else if (options.opera == 'resource-setting') {
        this.resourceVisible = true
      } else if (options.opera == 'daily-task') {
        this.taskDailyVisible = true
      } else if (options.opera == 'statistics') {
        // this.statisticsVisible = true
      }
    },
    manage(row) {
      this.info = row ? row : null
      this.visible = true
    }
  }
}
</script>
<style lang="scss" src="./css/project.scss" scoped></style>
