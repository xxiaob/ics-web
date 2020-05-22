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
            <list-item :item="item" @manage="manage(item)" @opera-change="operaChange"></list-item>
          </el-col>
        </el-row>
        <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
      </el-card>
      <jc-manage :options="info" :projectType="projectType" :visible.sync="visible" @save-success="initData"></jc-manage>
    </div>
    <grid-setting :options="grid" :visible.sync="gridVisible"></grid-setting>
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
    GridSetting: () => import('../projectSetting/grid')
  },
  data() {
    return {
      list: [],
      loading: false,
      visible: false,
      info: null,
      grid: { projectName: '--' },
      gridVisible: false,
      filter: {}
    }
  },
  watch: {
    '$route'() {
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
        let list = []

        if (resultList && resultList.length) {
          resultList.forEach(item => {
            list.push({ projectId: item.projectId, projectName: item.projectName, projectType: item.projectType, beginTime: item.beginTime, endTime: item.endTime, orgId: item.orgId, orgName: item.orgName, description: item.description })
          })
        }
        this.list = list
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
      if (options.opera == 'delete-success') {
        this.currentChange(this.page.pageNum - 1)
      } else if (options.opera == 'grid-setting') {
        this.grid = options.data
        this.gridVisible = true
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
