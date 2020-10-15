<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"  :projectList="projectList"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">组织业务</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" max-height="600">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="orgName" label="组织名称"></el-table-column>
        <el-table-column prop="inCircleJourney" label="巡逻里程(km)"></el-table-column>
        <el-table-column prop="inCircleDuration" label="巡逻时长(h)"></el-table-column>
        <el-table-column prop="outCircleJourney" label="出圈里程(km)"></el-table-column>
        <el-table-column prop="outCircleDuration" label="出圈时长(h)"></el-table-column>
        <el-table-column prop="journey" label="在岗里程(km)"></el-table-column>
        <el-table-column prop="onguardDuration" label="在岗时长(h)"></el-table-column>
        <el-table-column prop="inoutCount" label="岗点触碰"></el-table-column>
        <el-table-column prop="postTaskCount" label="岗点日常任务"></el-table-column>
        <el-table-column prop="postReachTaskCount" label="岗点达标任务"></el-table-column>
        <el-table-column prop="postReachRate" label="岗点任务达标率" :formatter="formatRate"></el-table-column>
        <el-table-column width="60" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

     <el-card class="jc-echart-card jc-mt">
      <el-row :gutter="0">
        <jc-statistics :statistics="statistics"></jc-statistics>
        <jc-service :list="list"></jc-service>
      </el-row>
    </el-card>

    <jc-detail :info="detailInfo" :visible.sync="detailVisible"></jc-detail>

  </div>
</template>
<script>

import { getAttendanceList, getAttendanceStatistics } from '@/api/organizeInfo'
import projectsMixins from '@/bundles/taskBundle/mixins/projectsMixins'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')


export default {
  name: 'OrganizeAttendanceIndex',
  mixins: [projectsMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('./modules/detail'),
    JcStatistics: () => import('./modules/statistics'),
    JcService: () => import('./modules/service')

  },
  data() {
    return {
      list: [],
      loading: false,
      visible: false,
      detailVisible: false,
      info: null,
      detailInfo: null,
      filter: {},
      orgId: '',
      statistics: null,
      completeType: 'task', // 业务完成率占比
      options: null // echarts参数
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async created() {
    await this.getProjects()
  },
  methods: {
    formatRate(row, column, cellValue) {
      // 格式化比率
      return cellValue * 100 + '%'
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        console.log('111this.filter', this.filter)
        try {
          let resultList = await getAttendanceList({ ...this.filter }) // 获取组织勤务列表

          this.statistics = await getAttendanceStatistics({ ...this.filter }) // 获取组织勤务统计


          const list = []

          //  组织列表数据
          if (resultList && resultList.length > 0) {
            resultList.forEach(item=>{
              list.push({
                inCircleDuration: item.inCircleDuration, // 巡逻时长
                inCircleJourney: item.inCircleJourney, // 巡逻里程
                outCircleDuration: item.outCircleDuration, // 出圈时长
                outCircleJourney: item.outCircleJourney, // 出圈里程
                onguardDuration: item.onguardDuration, //  在岗时长
                journey: item.journey, // 在岗里程
                inoutCount: item.inoutCount, // 岗点触碰
                orgId: item.orgId, // 组织id
                orgName: item.orgName, // 组成名称
                // postReachRate: item.postReachRate, // 岗点任务达标率
                // postReachTaskCount: item.postReachTaskCount, // 岗点任务达标
                // postTaskCount: item.postTaskCount, // 岗点日常任务
                projectId: item.projectId,
                projectName: item.projectName,
                postReachRate: 0.6, // 岗点任务达标率
                postReachTaskCount: 80, // 岗点任务达标
                postTaskCount: 100 // 岗点日常任务
              })
            })
          }
          this.list = list
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },

    goFilter(filter) {
      // 查询触发
      this.filter = filter
      this.initData()
    },
    async detail(row) {
      // 详情
      try {
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
