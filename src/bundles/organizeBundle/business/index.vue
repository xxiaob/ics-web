<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter" :projectList="projectList" ></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">组织业务</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" max-height="600">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="orgName" label="组织名称"></el-table-column>
        <el-table-column prop="eventReport" label="事件上报"></el-table-column>
        <el-table-column  label="事件类型Top3" min-width='100'>
           <template slot-scope="scope">
            <p v-for="(eventType,index) in scope.row.eventType" :key="index">{{eventType}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="taskLssus" label="任务下发"></el-table-column>
        <el-table-column label="任务来源Top3" min-width='100'>
          <template slot-scope="scope">
            <p v-for="(eventType,index) in scope.row.taskSource" :key="index">{{eventType}}</p>
          </template>

        </el-table-column>
        <el-table-column prop="taskAccept" label="任务接受"></el-table-column>
        <el-table-column prop="taskComplete" label="任务完成"></el-table-column>
        <el-table-column prop="taskCompleteRate" label="任务完成率"></el-table-column>
        <el-table-column prop="problemReport" label="问题上报"></el-table-column>
        <el-table-column label="问题类型Top3" min-width='100'>
          <template slot-scope="scope">
            <p v-for="(eventType,index) in scope.row.problemType" :key="index">{{eventType}}</p>
          </template>

        </el-table-column>
        <el-table-column prop="problemAccept" label="问题接受"></el-table-column>
        <el-table-column prop="problemHandle" label="问题处理"></el-table-column>
        <el-table-column prop="problemHandleRate" label="问题处理率"></el-table-column>
        <el-table-column width="80" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

     <el-card class="jc-echart-card jc-mt">
      <el-row :gutter="0">
        <jc-category></jc-category>
        <jc-complete></jc-complete>
      </el-row>
    </el-card>

    <jc-detail :info="detailInfo" :visible.sync="detailVisible"></jc-detail>

  </div>
</template>
<script>
import projectsMixins from '@/bundles/taskBundle/mixins/projectsMixins'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'OrganizeBusinessIndex',
  mixins: [projectsMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('./modules/detail'),
    JcCategory: () => import('./modules/category'),
    JcComplete: () => import('./modules/complete')
  },
  data() {
    return {
      list: [{ id: '1' }],
      loading: false,
      detailVisible: false,
      detailInfo: null,
      filter: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async created() {
    await this.getProjects()
  },
  methods: {
    async initData() {
      console.log('initData')
      if (!this.loading) {
        this.loading = true
        try {
          // const { total, resultList } = await eventManageList({ ...this.filter })

          // this.page.total = total
          // this.list = resultList
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      }
    },

    goFilter(filter) {
      console.log('filter', filter)
      this.filter = filter
      this.initData()
    },

    async detail(row) {
      console.log('row', row)
      try {
        // this.detailInfo = await eventManageGet(row.id)
        this.detailInfo = row
        this.detailVisible = true
      } catch (error) {
        console.error(error)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
// .jc-table{
//   max-height: 600px;
// }

/deep/ .jc-echart-card{
  & > .el-card__body{
    padding-top:0;

    .el-card__header{
      padding-left: 0;
    }

  }

  .el-card{
    box-shadow: none;
    border: none;

    .el-card__body{
      padding:4px;
    }
  }


  .jc-type-echarts{
    height: 260px;
  }
}
</style>
