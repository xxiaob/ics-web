<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">组织业务</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" max-height="500">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="orgName" label="组织名称" min-width="120"></el-table-column>
        <el-table-column prop="eventCount" label="事件上报"></el-table-column>
        <el-table-column label="事件类型Top3" min-width='100'>
          <template slot-scope="scope">
            <p v-for="(eventType,index) in scope.row.eventTypeFilter" :key="index">{{eventType.typeName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="taskCount" label="任务下发"></el-table-column>
        <el-table-column label="任务来源Top3" min-width='100'>
          <template slot-scope="scope">
            <p v-for="(taskSource,index) in scope.row.taskSourceFilter" :key="index">{{taskSource.typeName}}</p>
          </template>

        </el-table-column>
        <el-table-column prop="taskReceiveCount" label="任务接受"></el-table-column>
        <el-table-column prop="taskCompletedCount" label="任务完成"></el-table-column>
        <el-table-column prop="taskCompletedRate" label="任务完成率" :formatter="formatRate"></el-table-column>
        <el-table-column prop="problemReportCount" label="问题上报"></el-table-column>
        <el-table-column label="问题类型Top3" min-width='100'>
          <template slot-scope="scope">
            <p v-for="(problemType,index) in scope.row.problemTypeFilter" :key="index">{{problemType.typeName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="problemReceiveCount" label="问题接受"></el-table-column>
        <el-table-column prop="problemhandlingCount" label="问题处理"></el-table-column>
        <el-table-column prop="problemhandlingRate" label="问题处理率" :formatter="formatRate"></el-table-column>

        <el-table-column width="60" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="jc-echart-card jc-mt">
      <el-row :gutter="0">
        <jc-category :category="category"></jc-category>
        <jc-complete :taskRate="taskRate"></jc-complete>
      </el-row>
    </el-card>

    <jc-detail :info="detailInfo" :filter="filter" :visible.sync="detailVisible"></jc-detail>

  </div>
</template>
<script>

import { getBusinessList } from '@/api/organizeInfo'

export default {
  name: 'OrganizeBusinessIndex',

  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('./modules/detail'),
    JcCategory: () => import('./modules/category'),
    JcComplete: () => import('./modules/complete')
  },
  data() {
    return {
      list: [],
      loading: false,
      detailVisible: false,
      detailInfo: null,
      filter: {},
      taskRate: [], // 任务完成比例
      category: [] // 类别占比
    }
  },


  methods: {
    formatRate(row, column, cellValue) {
      // 格式化比率
      return cellValue * 100 + '%'
    },
    indexMethod(index) {
      //处理序号
      if (index == 0) {
        return '总'
      }
      return index
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { top: resultList, left: category } = await getBusinessList(this.filter)


          // 处理top数据
          if (resultList && resultList.length) {
            resultList.forEach(item => {
              item.eventTypeFilter = [...(item.eventType || [])].splice(0, 3)
              item.problemTypeFilter = [...(item.problemType || [])].splice(0, 3)
              item.taskSourceFilter = [...(item.taskSource || [])].splice(0, 3)
            })
          }
          this.list = resultList


          // 处理业务完成率数据
          let taskRate = resultList.map(item => {
            return {
              orgName: item.orgName,
              taskCompletedRate: item.taskCompletedRate,
              problemhandlingRate: item.problemhandlingRate
            }
          })

          this.taskRate = taskRate


          // 业务类别占比
          this.category = category
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      }
    },

    goFilter(filter) {
      // console.log('filter', filter)
      this.filter = filter
      this.initData()
    },

    async detail(row) {
      // console.log('row', row)
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
.jc-table {
  & >>> .el-table__row {
    &:first-child {
      color: $jc-color-primary;
    }
  }
}
/deep/ .jc-echart-card {
  & > .el-card__body {
    padding-top: 0;

    .el-card__header {
      padding-left: 0;
    }
  }

  .el-card {
    box-shadow: none;
    border: none;

    .el-card__body {
      padding: 4px;
    }
  }

  .jc-type-echarts {
    height: 260px;
  }
}
</style>
