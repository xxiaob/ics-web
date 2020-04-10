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
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="icon" label="菜单图标"></el-table-column>
        <el-table-column prop="name" label="菜单名称"></el-table-column>
        <el-table-column prop="parentName" label="上级菜单"></el-table-column>
        <el-table-column prop="adress" label="菜单地址"></el-table-column>
        <el-table-column width="120" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="manage(scope.row)">编辑</el-button>
            <el-button type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="info ? '编辑菜单':'新增菜单'" :visible.sync="visible" width="500" :append-to-body="true">
      <jc-manage :options="info" :visible.sync="visible"></jc-manage>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'SystemMenusIndex',
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage')
  },
  data() {
    return {
      list: [{ id: 1, icon: 'aa', name: 'asdf', parentName: 'asdf', adress: '11' }],
      loading: false,
      visible: false,
      info: null,
      filter: {}
    }
  },
  methods: {
    goFilter(filter) {
      this.filter = filter
      this.currentChange(1)
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
