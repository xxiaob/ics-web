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
        <jc-statistics></jc-statistics>
        <jc-service :list="list"></jc-service>
      </el-row>
    </el-card>

    <jc-detail :info="detailInfo" :visible.sync="detailVisible"></jc-detail>

  </div>
</template>
<script>
// import { eventManageList, eventManageDel, eventManageGet } from '@/api/eventManage'
// import { formatDate } from '@/libs/util'
// import PaginationMixins from '@/mixins/PaginationMixins'
// import { organizationList } from '@/api/organization'

import { getAttendanceList } from '@/api/organizeInfo'
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
      // orgTree: [],
      // orgObj: {},
      list: [],
      loading: false,
      visible: false,
      detailVisible: false,
      info: null,
      detailInfo: null,
      filter: {},
      orgId: '',

      completeType: 'task', // 业务完成率占比
      options: null // echarts参数
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async created() {
    // await this.getOrgTree()
    await this.getProjects()

    // this.initData()
  },
  methods: {
    formatRate(row, column, cellValue) {
      // 格式化比率
      return cellValue * 100 + '%'
    },
    // formatTime(row, column, cellValue) {
    //   return formatDate(cellValue)
    // },
    // formatOrg(row, column, cellValue) {
    //   return this.orgObj[cellValue]
    // },
    // formatOrgTree(child) {
    //   let trees = []

    //   if (child && child.length) {
    //     child.forEach(item => {
    //       let node = {
    //         value: item.orgId,
    //         label: item.orgName
    //       }

    //       let children = this.formatOrgTree(item.children)

    //       if (children && children.length) {
    //         node.children = children
    //       }

    //       trees.push(node)
    //     })
    //   }
    //   return trees
    // },
    // formatOrgTreeToObj(child) {
    //   let objs = {}

    //   if (child && child.length) {
    //     child.forEach(item => {
    //       if (item.children && item.children.length) {
    //         objs = Object.assign(objs, this.formatOrgTreeToObj(item.children))
    //       }
    //       objs[item.orgId] = item.orgName
    //     })
    //   }
    //   return objs
    // },
    // async getOrgTree() {
    //   const res = await organizationList()

    //   this.orgTree = this.formatOrgTree(res)
    //   this.orgObj = this.formatOrgTreeToObj(res)
    // },
    async initData() {
      if (!this.loading) {
        this.loading = true
        console.log('111this.filter', this.filter)
        try {
          // const { total, resultList } = await eventManageList({ ...this.filter, ...this.page })
          let resultList = await getAttendanceList({ ...this.filter })

          console.log('datas', resultList)


          const list = []

          // 事件数据
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
                postReachRate: item.postReachRate, // 岗点任务达标率
                postReachTaskCount: item.postReachTaskCount, // 岗点任务达标
                postTaskCount: item.postTaskCount, // 岗点日常任务
                projectId: item.projectId,
                projectName: item.projectName
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
