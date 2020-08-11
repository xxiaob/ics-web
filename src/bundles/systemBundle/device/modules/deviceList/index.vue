<template>
  <div>
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="roleId" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="orgName" label="所属组织"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="详情"></el-button>
            <el-button type="text" size="mini" icon="el-icon-setting" @click="manage(scope.row)" title="设置"></el-button>
            <el-button type="text" size="mini" icon="el-icon-video-camera" @click="showVideo(scope.row)" title="视频记录"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
    <jc-manage :options="info" :orgId="orgId" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import { roleList } from '@/api/role'
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
      filter: { }
    }
  },
  methods: {
    async initData(orgId) {
      if (orgId) {
        this.orgId = orgId
      }
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await roleList({ ...this.filter, ...this.page, orgId: this.orgId })

          this.page.total = total
          let list = []

          if (resultList && resultList.length) {
            resultList.forEach(item => {
              list.push({ roleId: item.roleId, roleName: item.roleName, orgId: item.orgId, orgName: item.orgName, createTime: formatDate(item.createTime) })
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
    detail(row) {
      console.log('detail', row)
    },
    manage(row) {
      this.info = row
      this.visible = true
    },
    showVideo(row) {
      console.log('showVideo', row)
    }
  }
}
</script>
