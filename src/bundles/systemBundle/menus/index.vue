<template>
  <div class="jc-main-container-warp">
    <tab-filter></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="manage(null)">添加</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="resId" class="jc-table">
        <el-table-column prop="icon" label="菜单图标">
          <template slot-scope="scope">
            <i v-if="scope.row.icon" :class="'iconfont ' + scope.row.icon"></i>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="resName" label="菜单名称"></el-table-column>
        <el-table-column prop="pName" label="上级菜单"></el-table-column>
        <el-table-column prop="url" label="菜单地址"></el-table-column>
        <el-table-column prop="sort" label="序号"></el-table-column>
        <el-table-column width="120" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="manage(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <jc-manage :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import { menusList, menusDel } from '@/api/menus'

export default {
  name: 'SystemMenusIndex',
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
      filter: {}
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (!this.loading) {
        this.loading = true
        menusList().then(res => {
          this.list = this.formatTree(res)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    formatTree(child, pName = '--') {
      let list = []

      if (child && child.length) {
        child.forEach(item => {
          list.push({ resId: item.resId, resName: item.resName, sort: item.sort, pid: item.pid, pName: pName, url: item.url, icon: item.icon || '' })
          list = [...list, ...this.formatTree(item.children, item.resName)]
        })
      }
      return list
    },
    goFilter(filter) {
      this.filter = filter
      this.currentChange(1)
    },
    del(row) {
      this.$confirm('确认删除该菜单', '提示', { type: 'warning' }).then(() => {
        menusDel(row.resId).then(() => {
          this.$message.success('删除成功')
          this.initData()
        })
      }).catch(() => {})
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
