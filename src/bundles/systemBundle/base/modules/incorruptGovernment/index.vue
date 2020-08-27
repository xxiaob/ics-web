
<template>
  <!-- class="jc-main-container-warp" -->
  <div>
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">内容列表</div>
        <div class="jc-button-group jc-flex-warp">
          <div class="jc-current-organization jc-flex-warp">
            <span>当前组织: </span>
            <span class="jc-organization" v-text="user && user.orgName"></span>
          </div>
          <el-button type="primary" size="small" @click="manage(null)">新增</el-button>
          <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="removeAll">删除</el-button> -->
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="positionId" class="jc-table" @selection-change="tableSelect">
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="systemName" label="廉政语录"></el-table-column>
        <el-table-column prop="enabled" label="创建人" :formatter="formatStatus"></el-table-column>
        <!--  滚动开关-->
        <el-table-column prop="scrollSwitch" label="是否启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enableRollingMessage" active-color="#409EFF" inactive-color="#cccccc" :active-value="1" :inactive-value="0" @change="scrollSwitchChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="newWindow" label="时间" :formatter="formatStatus"></el-table-column>
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
import { getRollingMessage } from '@/api/baseConfig'
import { formatDate } from '@/libs/util'

export default {
  name: 'SystemBaseGovernment',
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
  props: {
    user: {
      type: Object,
      default: ()=>{}
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    console.log(user)
  },
  methods: {

    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    formatStatus(row, column, cellValue) {
      return cellValue ? '是' : '否'
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const list = await getRollingMessage({ ...this.filter, ...this.page })

          console.log('list', list)
          let { total, resultList } = list

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
          ids.push(item.positionId)
        })
      }
      this.ids = ids
    },
    del(row) {
      this.$confirm('确认删除', '提示', { type: 'warning' }).then(() => {
        this.remove(row.id)
      }).catch(() => {})
    },
    remove(ids) {
      // delSystemIndex(ids).then(() => {
      //   this.$message.success('删除成功')
      //   this.currentChange(this.page.pageNum - 1)
      // })
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
.jc-current-organization {
  align-items: center;
  margin-right: 20px;
  .jc-organization {
    padding: 0 10px;
    color: #666;
  }
}
.el-table /deep/ {
  img {
    max-height: 100px;
    max-width: 100%;
  }
}
</style>
