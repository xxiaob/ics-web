<template>
  <div>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">内容列表</div>
        <div class="jc-button-group">
          <span style="margin-right:20px">当前组织 : {{user.orgName}}</span>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="manage(null)">添加</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="positionId" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="url" label="banner图片">
          <template slot-scope="scope">
            <img :src="scope.row.url" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="enable" label="是否启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enable" :active-value="1" :inactive-value="0" @change="enableChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" width="140"></el-table-column>
        <el-table-column width="60" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>

    <jc-manage :options="info" :user="user" :visible.sync="visible" @save-success="initData"></jc-manage>

  </div>
</template>
<script>
import PaginationMixins from '@/mixins/PaginationMixins'
import { appBannerList, deleteAppBanner, enableAppBanner } from '@/api/baseConfig'
import { formatDate } from '@/libs/util'

export default {
  name: 'SystemBaseAppBanner',
  mixins: [PaginationMixins],
  components: {
    JcManage: () => import('./modules/manage')
  },
  props: {
    user: {
      type: Object,
      default: ()=>{}
    }
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
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await appBannerList({ ...this.filter, ...this.page })

          this.list = resultList
          this.page.total = total
          this.loading = false
        } catch (error) {
          this.loading = false
          console.log(error)
        }
      }
    },
    del(row) {
      this.$confirm('确认删除', '提示', { type: 'warning' }).then(() => {
        this.remove(row.id)
      }).catch(() => {})
    },
    remove(ids) {
      deleteAppBanner(ids).then(() => {
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
    },
    enableChange(row) {
      this.$confirm('确认修改启用', '提示', { type: 'warning' }).then(async () => {
        try {
          await enableAppBanner({ id: row.id, enable: row.enable })
          this.$message.success('操作成功')
        } catch (error) {
          console.error(error)
          row.enable = row.enable ? 0 : 1
        }
      }).catch(() => {
        row.enable = row.enable ? 0 : 1
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table /deep/ {
  img {
    max-height: 100px;
    max-width: 100%;
  }
}
</style>
