<template>
  <div>
    <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" size="mini">
      <el-table-column type="index" label="序号" width="50" v-if="!small"></el-table-column>
      <el-table-column prop="eventTitle" label="事件标题" show-overflow-tooltip></el-table-column>
      <el-table-column prop="typeName" label="事件类型" v-if="!small"></el-table-column>
      <el-table-column prop="reportUserName" label="上报人" v-if="!small"></el-table-column>
      <el-table-column prop="orgName" label="所属组织" v-if="!small"></el-table-column>
      <el-table-column prop="desc" label="事件描述" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" v-if="!small"></el-table-column>
      <el-table-column width="60" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <jc-event-detail :info="detailInfo" :visible.sync="detailVisible"></jc-event-detail>

  </div>
</template>

<script>
import { eventManageListByTask } from '@/api/eventManage'
import { eventManageGet } from '@/api/eventManage'
import { formatDate } from '@/libs/util'

export default {
  name: 'TaskProcessDetailEvent',
  props: {
    small: false,
    taskId: {
      type: String,
      default: ''
    }
  },
  components: {
    JcEventDetail: () => import('@/bundles/taskBundle/eventManage/modules/detail')
  },
  data() {
    return {
      list: [],
      loading: false,
      detailVisible: false,
      detailInfo: null
    }
  },
  watch: {
    taskId(newValue) {
      if (newValue) {
        this.initData()
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    async initData() {
      if (!this.loading && this.taskId) {
        this.loading = true
        try {
          const resultList = await eventManageListByTask(this.taskId)
          const list = []

          if (resultList && resultList.length > 0) {
            resultList.forEach(item=>{
              list.push({
                createTime: item.createTime,
                desc: item.desc,
                eventTitle: item.eventTitle,
                typeName: item.typeName,
                id: item.id,
                orgName: item.orgName,
                reportUserName: item.reportUserName
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
    async detail(row) {
      try {
        this.detailInfo = await eventManageGet(row.id)
        this.detailVisible = true
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
