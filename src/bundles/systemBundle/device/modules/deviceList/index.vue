<template>
  <div>
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="manage(null)">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="removeAll">删除</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="roleId" class="jc-table" @selection-change="tableSelect">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="orgName" label="所属组织"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column width="60" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" title="编辑"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
    <jc-manage :options="info" :orgId="orgId" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import { roleList, roleDel, roleGet } from '@/api/role'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'

export default {
  name: 'SystemDeviceTable',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('../tabFilter'),
    JcManage: () => import('../manage')
  },
  data() {
    return {
      list: [],
      loading: false,
      visible: false,
      info: null,
      orgId: '',
      ids: [],
      filter: { }
    }
  },
  methods: {
    initData(orgId) {
      if (orgId) {
        this.orgId = orgId
      }
      if (!this.loading) {
        this.loading = true
        roleList({ ...this.filter, ...this.page, orgId: this.orgId }).then(res => {
          this.page.total = res.total

          let list = []

          if (res.resultList && res.resultList.length) {
            res.resultList.forEach(item => {
              list.push({ roleId: item.roleId, roleName: item.roleName, orgId: item.orgId, orgName: item.orgName, createTime: formatDate(item.createTime) })
            })
          }
          this.list = list
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
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
          ids.push(item.roleId)
        })
      }
      this.ids = ids
    },
    del(row) {
      this.$confirm('确认删除该角色', '提示', { type: 'warning' }).then(() => {
        this.remove([row.roleId])
      }).catch(() => {})
    },
    removeAll() {
      if (this.ids.length) {
        this.$confirm('确认删除选中的角色', '提示', { type: 'warning' }).then(() => {
          this.remove(this.ids)
        }).catch(() => {})
      } else {
        this.$message.error('请先选择删除项')
      }
    },
    remove(ids) {
      roleDel(ids).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    },
    manage(row) {
      if (row) {
        roleGet(row.roleId).then(res => {
          this.info = { roleId: res.roleId, roleName: res.roleName, orgId: res.orgId, resIds: res.resIds }
          this.visible = true
        })
      } else {
        this.info = null
        this.visible = true
      }
    }
  }
}
</script>
