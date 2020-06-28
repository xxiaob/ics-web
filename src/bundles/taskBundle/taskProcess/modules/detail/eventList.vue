<template>
  <div>
    <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" size="mini">
      <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
      <el-table-column prop="eventTitle" label="事件标题"></el-table-column>
      <el-table-column prop="typeName" label="事件类型"></el-table-column>
      <el-table-column prop="reportUserName" label="上报人"></el-table-column>
      <el-table-column prop="orgName" label="所属组织"></el-table-column>
      <el-table-column prop="desc" label="事件描述" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" :formatter="formatTime"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { eventManageListByTask } from '@/api/eventManage'
import { formatDate } from '@/libs/util'

export default {
  name: 'TaskProcessDetailEvent',
  props: {
    taskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      loading: false
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
    }
  }
}
</script>
