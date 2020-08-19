<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="manage(null)">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="removeAll">删除</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" @selection-change="tableSelect" :cell-class-name="cellClass">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="pkgName" label="应用名称"></el-table-column>
        <el-table-column prop="deviceType" label="设备类型" :formatter="formatDeviceType"></el-table-column>
        <el-table-column prop="version" label="版本号"></el-table-column>
        <el-table-column prop="url" label="设备包名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="state" label="状态" :formatter="formatState"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime"></el-table-column>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="manage(scope.row,true)" title="查看"></el-button>
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" title="编辑" :disabled="!!scope.row.state"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除" :disabled="!!scope.row.state"></el-button>
            <el-button v-if="!scope.row.state" type="text" size="mini" icon="el-icon-caret-right" @click="publish(scope.row.id,1)" title="发布"></el-button>
            <el-button v-if="scope.row.state" type="text" size="mini" icon="el-icon-video-pause" @click="publish(scope.row.id,0)" title="撤回"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>

    </el-card>
    <jc-manage :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import { deviceUpdateList, deviceUpdateDel, deviceUpdatePublish } from '@/api/deviceUpdate'
import { formatDate } from '@/libs/util'
import { deviceTypes, states } from './const'
import PaginationMixins from '@/mixins/PaginationMixins'

export default {
  name: 'SystemDeviceUpdateIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage')
  },
  data() {
    return {
      list: [],
      loading: false,
      visible: false,
      info: null,
      ids: [],
      filter: {}
    }
  },
  created() {
    this.initData()
  },
  methods: {
    cellClass({ row, column }) {
      if (column.property === 'state') {
        if (row.state) {
          return 'jc-state-publish'
        } else {
          return 'jc-state-unpublish'
        }
      }
    },
    formatDeviceType(row, column, cellValue) {
      return deviceTypes[cellValue]
    },
    formatState(row, column, cellValue) {
      return states[cellValue]
    },
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await deviceUpdateList({ ...this.filter, ...this.page })

          this.page.total = total
          const list = []

          if (resultList && resultList.length > 0) {
            resultList.forEach(item=>{
              list.push({
                id: item.id,
                deviceType: item.deviceType,
                pkgName: item.pkgName,
                state: item.state,
                updateInfo: item.updateInfo,
                url: item.url,
                createTime: item.createTime,
                version: item.version
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
      this.currentChange(1)
    },
    tableSelect(selections) {
      let ids = []

      if (selections && selections.length) {
        selections.forEach(item=> {
          ids.push(item.id)
        })
      }
      this.ids = ids
    },
    del(row) {
      this.$confirm('确认删除该版本', '提示', { type: 'warning' }).then(() => {
        this.remove([row.id])
      }).catch(() => {})
    },
    removeAll() {
      if (this.ids.length) {
        this.$confirm('确认删除选中的版本', '提示', { type: 'warning' }).then(() => {
          this.remove(this.ids)
        }).catch(() => {})
      } else {
        this.$message.error('请先选择删除项')
      }
    },
    remove(ids) {
      deviceUpdateDel(ids).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    },
    manage(row, view) {
      if (row) {
        this.info = row
        if (view) {
          this.info.view = true
        } else {
          this.info.view = false
        }
        this.visible = true
      } else {
        this.info = null
        this.visible = true
      }
    },
    publish(id, state) {
      const tip = state ? '发布' : '撤回'

      this.$confirm(`确认${tip}版本`, '提示', { type: 'warning' }).then(async () => {
        console.log(id, state)
        try {
          await deviceUpdatePublish({ pkgId: id, state })
          this.currentChange(this.page.pageNum)
          this.$message.success('操作成功')
        } catch (error) {
          console.error(error)
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table /deep/ {
  .jc-state-unpublish {
    color: $jc-color-danger;
  }
  .jc-state-publish {
    color: $jc-color-success;
  }
}
</style>
