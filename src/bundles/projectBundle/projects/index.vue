<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-mt">
      <el-row>
        <el-col :span="6">
          <div class="jc-project-item">
            <div class="jc-item-add">添加项目</div>
          </div>
        </el-col>
        <el-col :span="6" v-for="item in list" :key="item.projectId">
          <div class="jc-project-item" :class="getItemClass(item.projectType)">
            <div class="jc-title-warp">
              <div class="jc-title" v-text="item.title"></div>
              <i class="jc-setting iconfont iconshezhi"></i>
            </div>
            <div class="jc-project-screen">
              <div class="jc-screen jc-screen-command">指挥大屏</div>
              <div class="jc-screen jc-screen-data">数据大屏</div>
            </div>
            <div class="jc-project-footer">
              <div class="jc-project-info jc-not-start">
                <div class="jc-info-item"><i class="iconfont iconmingchengguanliqi"></i>{{item.title}}</div>
                <div class="jc-info-item"><i class="iconfont iconshijian1"></i>{{item.title}}</div>
              </div>
              <div class="jc-project-opera"></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
    <jc-manage :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import PaginationMixins from '@/mixins/PaginationMixins'
import { PROJECT_TYPES } from '@/constant/Dictionaries'
import { projectsListByPage, projectsDel } from '@/api/projects'

export default {
  name: 'ProjectProjects',
  mixins: [PaginationMixins],
  props: ['projectType'],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage')
  },
  data() {
    return {
      list: [{ projectId: 1, title: '扫雪防冻专项管控', projectType: 1 }, { projectId: 2, title: '扫雪防冻专项管控', projectType: 2 }],
      loading: false,
      visible: false,
      info: null,
      filter: {}
    }
  },
  watch: {
    '$route'() {
      this.filter = {}
      this.initData()
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (!this.loading) {
        this.loading = true
        projectsListByPage({ projectType: this.projectType, ...this.filter }).then(res => {
          console.log('项目管理', res)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    goFilter(filter) {
      this.filter = { ...filter }
      this.currentChange(1)
    },
    getItemClass(projectType) {
      let types = new Map([[PROJECT_TYPES.EmergencySupport, 'jc-project-es'], [PROJECT_TYPES.SpecialControl, 'jc-project-sc']])

      return types.get(projectType + '') || ''
    },
    del(row) {
      this.$confirm('确认删除该项目', '提示', { type: 'warning' }).then(() => {
        projectsDel(row.projectId).then(() => {
          this.$message.success('删除成功')
          this.currentChange(this.page.pageNum - 1)
        })
      }).catch(() => {})
    },
    manage(row) {
      if (row) {
        this.info = row
        this.visible = true
      } else {
        this.info = null
        this.visible = true
      }
    }
  }
}
</script>
<style lang="scss" src="./css/project.scss" scoped></style>
