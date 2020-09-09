<template>
  <div class="jc-main-container-warp">
    <div v-show="!detailShow">
      <tab-filter :types="types" @filter="goFilter"></tab-filter>

      <el-card class="jc-table-card jc-mt">
        <div slot="header" class="jc-card-header">
          <div class="jc-card-title">列表内容</div>
        </div>
        <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
          <el-table-column type="index" :index="indexMethod" label="序号" width="80"></el-table-column>
          <el-table-column prop="alarmTypeName" label="告警类型" width="120"></el-table-column>
          <el-table-column prop="transportCompany" label="企业" width="320"></el-table-column>
          <el-table-column prop="carNumber" label="企业地址"></el-table-column>
          <el-table-column prop="carNumber" label="车牌号"></el-table-column>
          <el-table-column prop="carSpeed" label="车速"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="alarmDate" label="时间" width="160"></el-table-column>
          <el-table-column width="50" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-refresh-right" @click="handle(scope.row,true)" title="查看"></el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
      </el-card>
    </div>

    <jc-detail v-show="detailShow" :types="types" :info="info" :user="user" :orgTree="orgTree" :detailShow.sync="detailShow" @save-success="initData"></jc-detail>
  </div>
</template>

<script>
import { getByType } from '@/api/supervise'
import { getDregsAlarmList } from '@/api/dregsAlarm'
import { LAWS_TYPES } from '@/constant/Dictionaries'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'dregsWaringHandleIndex',
  mixins: [PaginationMixins],
  data() {
    return {
      loading: false,
      list: [],
      filter: {},
      types: [],
      orgTree: [],
      info: null,
      detailShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async created() {
    await this.getOrgTree()
    this.getStatuteTypes()
    this.initData()
  },
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('./modules/detail')
  },
  methods: {
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
      this.firstOrgIds = res.map(item=>item.orgId)
    },
    async initData() {
      // 初始获取数据
      if (!this.loading) {
        this.loading = true
        try {
          let filter = this.filter // 获取所有查询条件

          Object.keys(filter).map(key => { // 过滤条件为空的字段
            if (!filter[key]) {
              delete filter[key]
            }
          })
          const { total, resultList } = await getDregsAlarmList({ ...this.filter, ...this.page })

          this.page.total = total
          this.list = resultList
          this.loading = false

          // 请求数据
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },
    async getStatuteTypes() {
      // 获取类型
      this.types = await getByType({ type: LAWS_TYPES.ALARM }) // 获取告警类型
      console.log('this.type', this.types)
    },
    goFilter(filter) {
      this.filter = filter // 获取查询信息
      this.currentChange(1) // 切换页面方法,在切换页面方法中调用initData初始化数据
    },
    //handle   true处理问题  false 查看问题
    handle(row, handle) {
      console.log('告警处理', row)
      this.info = row
      this.info.handle = handle
      this.orgId = this.user.orgId
      this.detailShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

