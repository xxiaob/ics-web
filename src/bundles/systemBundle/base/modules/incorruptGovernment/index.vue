
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
        <el-table-column prop="rollingMessage" label="廉政语录"></el-table-column>
        <el-table-column prop="creator" width="160" label="创建人"></el-table-column>
        <!--  滚动开关-->
        <el-table-column prop="enableRolling" width="160" label="是否启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enableRolling" active-color="#409EFF" inactive-color="#cccccc" :active-value="1" :inactive-value="0" @change="scrollSwitchChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="200" :formatter="formatTime"></el-table-column>
        <el-table-column width="60" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" title="编辑"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
    <jc-manage :options="info" :orgId="user && user.orgId" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import PaginationMixins from '@/mixins/PaginationMixins'
import { getRollingMessage, rollingMessageUpdate, rollingMessageDel } from '@/api/baseConfig'
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
  watch: {
    user: {
      immediate: true,
      handler: 'initData'
    }
  },
  methods: {
    // 滚动开关切换
    scrollSwitchChange(row) {
      // 获取更新需要的id和enableRollingMessage值
      let { messageId, enableRolling } = row

      // 弹窗显示内容
      let isSwitchVal = enableRolling ? '开启' : '关闭'

      // 开关旧值,如果用户现金取消或更新失败, 回复到旧值状态
      let oldVal = enableRolling ? 0 : 1

      // 弹窗提示用户是否更新
      this.$confirm(`确认${isSwitchVal}滚动内容`, '提示', { type: 'warning', dangerouslyUseHTMLString: true })
        .then(() => {
          rollingMessageUpdate({ messageId, enableRolling })
            .then(() => {
              this.$message.success('设置成功')
            }).catch(() => {
              console.log(22)
              row.enableRolling = oldVal
            })
        })
        .catch(() => {
          console.log(11)
          row.enableRolling = oldVal
        })
    },
    formatTime(row, column, cellValue) {
      // 格式化时间
      return formatDate(cellValue)
    },
    async initData() {
      if (!this.user || !this.user.orgId) {
        return
      }
      this.filter.orgId = this.user.orgId

      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await getRollingMessage({ ...this.filter, ...this.page })

          this.list = resultList
          this.page.total = total
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      }
    },
    goFilter(filter) {
      this.filter = { ...filter, orgId: this.user.orgId }
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
        this.remove(row.messageId)
      }).catch(() => {})
    },
    remove(ids) {
      rollingMessageDel({ messageId: ids }).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    },
    manage(row) {
      if (row) {
        console.log('row', row)
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
