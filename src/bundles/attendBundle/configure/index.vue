<template>
  <div class="jc-main-container-warp">
    <tab-filter :userId="user.userId" :people="true" :orgTree="orgTree" @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="manage(null)">新增配置</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="attendanceName" label="考勤名称"></el-table-column>
        <el-table-column prop="orgName" label="所属组织"></el-table-column>
        <el-table-column prop="startWorkTime" label="上班时间"></el-table-column>
        <el-table-column prop="endWorkTime" label="下班时间"></el-table-column>
        <el-table-column prop="enabled" label="考勤状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" :active-value="ATTEND_CONFIGURE_STATUSES.ENABLED" :inactive-value="ATTEND_CONFIGURE_STATUSES.NOTENABLED" @change="enabledChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="140" :formatter="formatTime"></el-table-column>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button> -->
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" title="编辑"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>

    <jc-manage :orgTree="orgTree" :orgId="orgId" :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import { cfgList, cfgGet, cfgDel, uptStatus } from '@/api/attend'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
import { ATTEND_CONFIGURE_STATUSES } from '@/constant/Dictionaries'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'ConfigureIndex',
  mixins: [PaginationMixins],
  components: {
    JcManage: () => import('./modules/manage'),
    TabFilter: () => import('./modules/tabFilter')
  },
  data() {
    return {
      ATTEND_CONFIGURE_STATUSES,
      info: null,
      visible: false,
      orgId: '',
      orgTree: [],
      list: [],
      loading: false,
      filter: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async created() {
    await this.getOrgTree()
    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    formatStatus(row, column, cellValue) {
      return ATTEND_CONFIGURE_STATUSES.toString(cellValue.toString())
    },
    formatOrgTree(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = {
            value: item.orgId,
            label: item.orgName
          }

          let children = this.formatOrgTree(item.children)

          if (children && children.length) {
            node.children = children
          }

          trees.push(node)
        })
      }
      return trees
    },
    async getOrgTree() {
      const res = await organizationList()

      this.orgTree = this.formatOrgTree(res)
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await cfgList({ ...this.filter, ...this.page })

          this.page.total = total
          this.list = resultList
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
    async manage(row) {
      if (row) {
        const res = await cfgGet(row.id)

        this.info = res
      } else {
        this.info = null
      }
      this.orgId = this.user.orgId
      this.visible = true
    },
    del(row) {
      this.$confirm('确认删除该配置', '提示', { type: 'warning' }).then(() => {
        this.remove(row.id)
      }).catch(() => {})
    },
    remove(id) {
      cfgDel(id).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    },
    enabledChange(row) {
      this.$confirm('确认修改状态', '提示', { type: 'warning' }).then(async () => {
        console.log( row.enabled, row.id)
        try {
          await uptStatus({ id: row.id, enabled: row.enabled })
          this.$message.success('操作成功')
        } catch (error) {
          console.error(error)
        }
      }).catch(() => {
        row.enabled = row.enabled ? 0 : 1
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
