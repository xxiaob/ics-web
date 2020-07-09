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
import { listByProblemId } from '@/api/task'
import { formatDate } from '@/libs/util'
import { projectsList } from '@/api/projects'
import { PROJECT_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'TaskQuestionProcessDetailTask',
  props: {
    problemId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [{ businessKey: '68793650535989248' }],
      loading: false,
      projectListArr: []
    }
  },
  watch: {
    problemId(newValue) {
      if (newValue) {
        this.initData(newValue)
      }
    }
  },
  created() {
    this.formatProjectList()
  },
  methods: {
    formatProject(row, column, cellValue) {
      const project = this.projectListArr.filter(item=>item.value == cellValue)

      return (project[0] && project[0].label) || PROJECT_TYPES.toString(PROJECT_TYPES.NORMAL)
    },
    async  formatProjectList() {
      this.EmergencySupport = await this.getProjectList(PROJECT_TYPES.EmergencySupport)
      this.SpecialControl = await this.getProjectList(PROJECT_TYPES.SpecialControl)

      this.projectListArr = []
      if (this.EmergencySupport) {
        this.projectListArr = [...this.projectListArr, ...this.EmergencySupport]
      }
      if (this.SpecialControl) {
        this.projectListArr = [...this.projectListArr, ...this.SpecialControl]
      }
    },
    async getProjectList(projectType) {
      const res = await projectsList({ projectType })

      if (res && res.length) {
        return res.map(item=>({ value: item.projectId, label: item.projectName }))
      } else {
        return null
      }
    },
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    async initData(problemId) {
      if (!this.loading) {
        this.loading = true
        try {
          const resultList = await listByProblemId(problemId)

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
