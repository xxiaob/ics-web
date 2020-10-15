<template>
  <div class="jc-main-container-warp">
    <tab-filter :orgTree="orgTree" @filter="goFilter" :userIds="userIds"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="userName" label="姓名" width="100"></el-table-column>
        <el-table-column prop="account" label="登录账户" width="100"></el-table-column>
        <el-table-column label="照片" width="80">
          <template slot-scope="scope">
            <img :src="scope.row.photo" width="100%" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="100"></el-table-column>
        <el-table-column prop="lawNbr" label="执法证号" width="100"></el-table-column>
        <el-table-column prop="chestNbr" label="胸牌编号" width="100"></el-table-column>
        <el-table-column prop="orgName" label="组织"></el-table-column>
        <el-table-column label="党员" width="60">
          <template slot-scope="scope">
            <span v-if="scope.row.partyMember === '1'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column  label="职位" width='100'>
          <template slot-scope="scope">
            <div v-for="(position,index) in scope.row.positions" :key="index">{{position}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="roles" label="角色">
           <template slot-scope="scope">
            <div v-for="(role,index) in scope.row.roles" :key="index">{{role}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="tasks" label="任务">
          <template slot-scope="scope">
            <div v-for="(task,index) in scope.row.tasks" :key="index">{{task}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime"></el-table-column>
        <el-table-column width="80" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button>
            <el-button type="text" size="mini" icon="el-icon-download" @click="exportData(scope.row)" title="下载"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>


    <jc-detail :info="detailInfo" :visible.sync="detailVisible"></jc-detail>

  </div>
</template>
<script>

import { organizationList } from '@/api/organization'
import { getUserInfoList, exportUserInfo } from '@/api/organizeInfo'

import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'UserInfoIndex',
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
      orgId: '',
      userIds: []
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
          const { total, resultList } = await getUserInfoList({ ...this.filter, ...this.page })

          this.page.total = total
          const list = []

          if (resultList && resultList.length > 0) {
            resultList.forEach(item=>{
              // 处理列表数据
              let positions = item.positions.map(position => position.positionName)

              let roles = item.roles.map(role => role.roleName )

              let tasks = item.tasks.map(task => task.taskName )

              // 提取有用数据
              list.push({
                userId: item.userId,
                userName: item.userName,
                account: item.account,
                photo: item.photo,
                phone: item.phone,
                lawNbr: item.lawNbr,
                chestNbr: item.chestNbr,
                orgId: item.orgId,
                orgName: item.orgName,
                partyMember: item.partyMember,
                positions,
                roles,
                tasks,
                createTime: item.createTime,
                description: item.description
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
    handleSelectionChange(selectVal) {
      // 获取多选框选择的数据
      this.userIds = selectVal.map(userInfo => userInfo.userId)
    },
    goFilter(filter) {
      this.filter = filter
      this.currentChange(1)
    },
    detail(row) {
      try {
        this.detailInfo = row
        this.detailVisible = true
      } catch (error) {
        console.error(error)
      }
    },
    exportData(row) {
      // 导出人员数据
      exportUserInfo({ userId: row.userId, orgId: row.orgId })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
