<template>
  <div class="jc-main-container-warp">
    <tab-filter :orgTree="orgTree" @filter="goFilter" @addopeartion="manage(null)"></tab-filter>

    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="thirdPartyName" label="第三方名称"></el-table-column>
        <el-table-column prop="orgName" label="所属组织"></el-table-column>
        <el-table-column prop="endTime" label="授权截止时间"></el-table-column>
        <el-table-column prop="appKey" label="appkey" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看详情"></el-button>
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" title="编辑"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>

    <jc-manage :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>

    <jc-third-detail :info="info" :visible.sync="detailVisible"></jc-third-detail>

  </div>
</template>

<script>
import { operationList, operationDel } from '@/api/operation'
// import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'

import { organizationList } from '@/api/organization'
export default {
  name: 'OperationThirdManageIndex',
  mixins: [PaginationMixins],
  data() {
    return {
      orgTree: [],
      orgObj: {},
      loading: false,
      list: [],
      filter: {},
      info: null,
      visible: false,
      detailVisible: false
    }
  },
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage'),
    JcThirdDetail: () => import('./modules/detail')

  },
  async created() {
    await this.getOrgTree()
    this.initData()
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

    goFilter(filter) {
      this.filter = filter // 获取查询信息
      this.currentChange(1) // 切换页面方法,在切换页面方法中调用initData初始化数据
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        console.log('this.page', this.page)
        try {
          const { total, resultList } = await operationList({ ...this.filter, ...this.page })


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
    // formatTime(row, column, cellValue) {
    //   // 格式化日期
    //   return formatDate(cellValue)
    // },
    manage(row) {
      // 新增弹窗
      if (row) {
        // 如果row有值为编辑
        // 发送请求获取数据, 将数据复制给info
        // this.info = res
        this.info = row
        this.visible = true
      } else {
        // 新增
        this.info = null
        this.visible = true
      }
    },

    detail(row) {
      // 查看详情
      console.log('row', row)
      this.info = row
      this.detailVisible = true
    },
    del(row) {
      // console.log('row', row)
      // 删除信息
      this.$confirm('确认删除该信息', '提示', { type: 'warning' }).then(() => {
        this.remove(row.id)
      }).catch(() => {})
    },
    remove(ids) {
      // 处理删除信息的路径
      operationDel(ids).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    }
  }


}
</script>

<style>
</style>
