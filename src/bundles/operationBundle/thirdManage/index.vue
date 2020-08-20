<template>
  <div class="jc-main-container-warp">
    <tab-filter :orgTree="orgTree" @filter="goFilter" @addopeartion="manage(null)"></tab-filter>

    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="thridName" label="第三方名称"></el-table-column>
        <el-table-column prop="orgId" label="所属组织" :formatter="formatOrg"></el-table-column>
        <el-table-column prop="endTime" label="授权截止时间" :formatter="formatTime"></el-table-column>
        <el-table-column prop="appkey" label="appkey" show-overflow-tooltip></el-table-column>
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

    <jc-manage :options="info" :visible.sync="visible"></jc-manage>

    <jc-third-detail :visible.sync="detailVisible"></jc-third-detail>

  </div>
</template>

<script>
import { videoList } from '@/api/record' // 待删除 , 替换第三方管理接口
import { formatDate } from '@/libs/util'
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
    JcThirdDetail: () => import('./detail')

  },
  async created() {
    await this.getOrgTree()
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
        try {
          const { total, resultList } = await videoList({ ...this.filter, ...this.page, videoType: 'VIDEO' })

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
    formatTime(row, column, cellValue) {
      // 格式化日期
      return formatDate(cellValue)
    },
    formatOrg(row, column, cellValue) {
      // 处理组织信息
      return this.orgObj[cellValue]
    },

    manage(row) {
      // 新增弹窗
      if (row) {
        // 如果row有值为编辑
        // 发送请求获取数据, 将数据复制给info
        // this.info = res
        this.info = {}
        this.visible = true
      } else {
        // 新增
        this.info = null
        this.visible = true
      }
    },

    detail() {
      // 查看详情
      console.log(11)
      this.detailVisible = true
    },
    del(row) {
      // 删除信息
      this.$confirm('确认删除该用户', '提示', { type: 'warning' }).then(() => {
        // 确认删除将id传给this.remove, 删除
        // this.remove([row.userId])

        this.remove(123) // 123替换为row中的id
        console.log('删除')
      }).catch(() => {})
    },
    remove(ids) {
      // 处理删除信息的路径
      console.log(ids)

      // userDel(ids).then(() => {
      //   this.$message.success('删除成功')
      //   this.currentChange(this.page.pageNum - 1)
      // })
    }
  }


}
</script>

<style>
</style>
