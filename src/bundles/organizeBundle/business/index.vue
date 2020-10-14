<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">组织业务</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" max-height="600">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="orgName" label="组织名称"></el-table-column>
        <el-table-column prop="eventReport" label="事件上报"></el-table-column>
        <el-table-column  label="事件类型Top3">
           <template slot-scope="scope">
            <p v-for="(eventType,index) in scope.row.eventType" :key="index">{{eventType}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="taskLssus" label="任务下发"></el-table-column>
        <el-table-column label="任务来源Top3">
          <template slot-scope="scope">
            <p v-for="(eventType,index) in scope.row.taskSource" :key="index">{{eventType}}</p>
          </template>

        </el-table-column>
        <el-table-column prop="taskAccept" label="任务接受"></el-table-column>
        <el-table-column prop="taskComplete" label="任务完成"></el-table-column>
        <el-table-column prop="taskCompleteRate" label="任务完成率"></el-table-column>
        <el-table-column prop="problemReport" label="问题上报"></el-table-column>
        <el-table-column label="问题类型Top3">
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
// import { eventManageList, eventManageDel, eventManageGet } from '@/api/eventManage'
// import { formatDate } from '@/libs/util'
// import PaginationMixins from '@/mixins/PaginationMixins'
// import { organizationList } from '@/api/organization'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')


export default {
  name: 'OrganizeBusinessIndex',
  // mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('./modules/detail'),
    JcCategory: () => import('./modules/category'),
    JcComplete: () => import('./modules/complete')

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

    this.initData()
  },
  methods: {
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
        try {
          // const { total, resultList } = await eventManageList({ ...this.filter, ...this.page })
          // const { total, resultList } = await eventManageList({ ...this.filter })

          // this.page.total = total
          const list = [
            {

              orgName: '南京市',
              eventReport: 105,
              eventType: ['市容环境', '宣传广告', '施工管理'],
              taskLssus: 37,
              taskSource: ['12345', '12319', '问题上报'],
              taskAccept: 39,
              taskComplete: 35,
              taskCompleteRate: '89.74%',
              problemReport: 37,
              problemType: ['市容环境', '宣传广告', '施工管理'],
              problemAccept: 39,
              problemHandle: 35,
              problemHandleRate: '89.74%'
            },
            {

              orgName: '南京市',
              eventReport: 105,
              eventType: ['市容环境', '宣传广告', '施工管理'],
              taskLssus: 37,
              taskSource: ['12345', '12319', '问题上报'],
              taskAccept: 39,
              taskComplete: 35,
              taskCompleteRate: '89.74%',
              problemReport: 37,
              problemType: ['市容环境', '宣传广告', '施工管理'],
              problemAccept: 39,
              problemHandle: 35,
              problemHandleRate: '89.74%'
            }

          ]

          // 事件数据


          // if (resultList && resultList.length > 0) {
          //   resultList.forEach(item=>{
          //     list.push({
          //       createTime: item.createTime,
          //       desc: item.desc,
          //       positionName: item.positionName,
          //       eventTitle: item.eventTitle,
          //       eventNumber: item.eventNumber,
          //       eventType: item.eventType,
          //       typeName: item.typeName,
          //       id: item.id,
          //       orgId: item.orgId,
          //       reportUser: item.reportUser,
          //       reportUserName: item.reportUserName
          //     })
          //   })
          // }
          this.list = list
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },

    goFilter(filter) {
      console.log('filter', filter)
      this.filter = filter
      this.currentChange(1)
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
