<template>
  <el-card class="jc-table-card jc-mt" size="mini" v-show="list&&list.length">
    <div slot="header">
      <div class="jc-title">任务</div>
    </div>
    <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" size="mini">
      <el-table-column prop="projectId" label="项目名称" :formatter="formatProject"></el-table-column>
      <el-table-column prop="taskTypeName" label="任务类型"></el-table-column>
      <el-table-column prop="startUser" label="下发人"></el-table-column>
      <el-table-column prop="startOrg" label="下发组织"></el-table-column>
      <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="taskStatusName" label="任务状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" width="140"></el-table-column>
      <el-table-column width="60" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-view" @click="handle(scope.row)" title="查看"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { getTaskByResource } from '@/api/dregsAlarm'
import { formatDate } from '@/libs/util'
import projectsMixins from '@/bundles/taskBundle/mixins/projectsMixins'
import { TASK_SOURCES } from '@/constant/Dictionaries'

export default {
  name: 'dregsWaringDetailTask',
  mixins: [projectsMixins],
  props: {
    sourceId: {
      type: String,
      default: ''
    },
    sourceType: {
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
    sourceId(newValue) {
      if (newValue) {
        this.initData(newValue)
      }
    }
  },
  created() {
    this.getProjects()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    async initData(sourceId ) {
      if (!this.loading) {
        this.loading = true
        try {
          const resultList = await getTaskByResource({ sourceId, sourceType: TASK_SOURCES.RESIDUEWARING } )

          console.log('resultList', resultList)
          this.list = resultList ? [resultList] : []
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },
    handle(row) {
      const { taskStatus, businessKey } = row

      console.log('row', row)
      window.open(`/task/taskProcess?taskStatus=${taskStatus}&businessKey=${businessKey}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card /deep/ .el-card__header {
  border: none;
}
.jc-title {
  color: $jc-color-primary;
}
</style>
