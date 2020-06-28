<template>
  <!-- <ul class="jc-ul">
    <li v-for="item in list" :key="item.id">
      <span>{{item.createTime|filterTime}}</span>
      <span>{{item.creatorId}}</span>
      <span>{{item.eventType|filterType}}</span>
      <span v-show="item.eventData">至</span>
      <template v-show="item.eventData">{{item|filterEventData}}</template>
    </li>
  </ul> -->
  <el-timeline>
    <el-timeline-item v-for="item in list" :key="item.id" :timestamp="item.createTime|filterTime" placement="top">
      <div>
        <span>{{item.creatorId}}</span>
        <span>{{item.eventType|filterType}}</span>
        <span v-show="item.eventData">至</span>
        <template v-show="item.eventData">{{item|filterEventData}}</template>
      </div>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
import { taskListRecord } from '@/api/task'
import { formatDate } from '@/libs/util'
import { TASK_REPEATS } from '@/constant/Dictionaries'

export default {
  name: 'TaskProcessDetailForward',
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
  filters: {
    filterTime(value) {
      return formatDate(value)
    },
    filterType(value) {
      return TASK_REPEATS.toString(value.toString())
    },
    filterEventData(value) {
      if (value.eventData) {
        const jsonData = JSON.parse(value.eventData)

        let res = jsonData.assignees

        if (jsonData.remark) {
          res += ('　备注　' + jsonData.remark)
        }
        return res
      }
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
          const resultList = await taskListRecord(this.taskId)

          this.list = resultList
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
<style lang="scss" scoped>
.jc-ul {
  list-style: none;
  li {
    line-height: 28px;
    span {
      margin-right: 10px;
    }
  }
}
</style>
