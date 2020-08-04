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
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" @selection-change="tableSelect">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="domain" label="域名" width="120"></el-table-column>
        <el-table-column prop="systemName" label="系统名称"></el-table-column>
        <el-table-column prop="domainLogo" label="系统logo">
          <template slot-scope="scope">
            <img :src="scope.row.domainLogo" alt="">
          </template>
        </el-table-column>
        <!-- <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" width="140"></el-table-column> -->

        <!-- 登录页面背景和窗口图 -->
        <el-table-column prop="firstPageLogo" label="登录页背景图">
          <template slot-scope="scope">
            <img :src="scope.row.firstPageLogo" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="firstPageLoginLogo" label="登录窗口背景图">
          <template slot-scope="scope">
            <img :src="scope.row.firstPageLoginLogo" alt="">
          </template>
        </el-table-column>
        <!-- 窗口位置 -->
        <el-table-column prop="loginLogoLocation" label="登录窗口位置" :formatter="formatLocation"></el-table-column>
        <!-- 入口路由 -->
        <el-table-column prop="entranceRouter" label="入口路由"></el-table-column>
        <!--  -->
        <el-table-column width="60" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" title="编辑"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
    <jc-manage :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import PaginationMixins from '@/mixins/PaginationMixins'
import { listByPage, del } from '@/api/domainLogo'
import { formatDate } from '@/libs/util'

import { LOGIN_WINDOWS_POSITION } from '@/constant/Dictionaries'
console.log(LOGIN_WINDOWS_POSITION )

export default {
  name: 'SystemNameIndex',
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
      filter: {},
      loginLogoLocation: LOGIN_WINDOWS_POSITION.VALUES

    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 处理窗口位置
    formatLocation(row, column, cellValue) {
      return LOGIN_WINDOWS_POSITION.toString(cellValue)
    },
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await listByPage({ ...this.filter, ...this.page })

          this.list = resultList
          this.page.total = total
          this.loading = false
        } catch (error) {
          this.loading = false
          console.log(error)
        }
      }
    },
    goFilter(filter) {
      this.filter = { ...filter }
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
      this.$confirm('确认删除该系统名称', '提示', { type: 'warning' }).then(() => {
        this.remove([row.id])
      }).catch(() => {})
    },
    removeAll() {
      if (this.ids.length) {
        this.$confirm('确认删除选中的系统名称', '提示', { type: 'warning' }).then(() => {
          this.remove(this.ids)
        }).catch(() => {})
      } else {
        this.$message.error('请先选择删除项')
      }
    },
    remove(ids) {
      del({ ids }).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    },
    manage(row) {
      if (row) {
        this.info = row
        this.visible = true
      } else {
        this.info = null
        this.visible = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table /deep/ {
  img {
    max-height: 60px;
    max-width: 100%;
  }
}
</style>
