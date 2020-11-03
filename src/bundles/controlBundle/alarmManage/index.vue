<template>
  <div class="jc-main-container-warp">
    <tab-filter :orgTree="orgTree" @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <!-- <div class="jc-button-group">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="manage(null)">事件上报</el-button>
        </div> -->
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="80"></el-table-column>
        <el-table-column prop="sources" label="信息来源"></el-table-column>
        <el-table-column prop="mark" label="违建标记"></el-table-column>
        <el-table-column prop="address" label="建筑地址"></el-table-column>
        <el-table-column prop="land" label="占地面积" ></el-table-column>
        <el-table-column prop="createTime" label="处置时间" :formatter="formatTime"></el-table-column>
        <el-table-column width="60" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>

    <jc-detail :info="detailInfo" :visible.sync="detailVisible"></jc-detail>

  </div>
</template>
<script>
// import { eventManageList, eventManageDel, eventManageGet } from '@/api/eventManage'
import { eventManageDel, eventManageGet } from '@/api/eventManage'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'alarmManageIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('./modules/detail')
  },
  data() {
    return {
      orgTree: [],
      orgObj: {},
      list: [],
      loading: false,
      visible: false,
      detailVisible: false,
      info: null,
      detailInfo: null,
      filter: {},
      orgId: ''
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
    formatOrg(row, column, cellValue) {
      return this.orgObj[cellValue]
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
    formatOrgTreeToObj(child) {
      let objs = {}

      if (child && child.length) {
        child.forEach(item => {
          if (item.children && item.children.length) {
            objs = Object.assign(objs, this.formatOrgTreeToObj(item.children))
          }
          objs[item.orgId] = item.orgName
        })
      }
      return objs
    },
    async getOrgTree() {
      const res = await organizationList()

      this.orgTree = this.formatOrgTree(res)
      this.orgObj = this.formatOrgTreeToObj(res)
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          // const { total, resultList } = await eventManageList({ systemModuleType: 1, ...this.filter, ...this.page })

          // this.page.total = total

          let resultList = new Array(4).fill(null)
          const list = []

          if (resultList && resultList.length > 0) {
            resultList.forEach(()=>{
              list.push({
                createTime: '2020-07-04',
                sources: '无人机提取',
                mark: '疑似漏报',
                address: '南京大数据产业基地',
                land: 89

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
    del(row) {
      this.$confirm('确认删除该事件', '提示', { type: 'warning' }).then(() => {
        this.remove(row.id)
      }).catch(() => {})
    },
    remove(id) {
      eventManageDel(id).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    },
    async manage(row) {
      if (row) {
        try {
          this.info = await eventManageGet(row.id)
        } catch (error) {
          console.error(error)
        }
      } else {
        this.info = null
      }
      this.orgId = this.user.orgId
      this.visible = true
    },
    detail(row) {
      this.detailInfo = row
      this.detailVisible = true
      // try {
      //   this.detailInfo = await eventManageGet(row.id)
      //   this.detailVisible = true
      // } catch (error) {
      //   console.error(error)
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
