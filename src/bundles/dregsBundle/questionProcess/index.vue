<template>
  <div class="jc-main-container-warp">

    <div v-show="!detailShow">
      <tab-filter :types="types" @filter="goFilter">
        <!-- <template v-slot:manage>
          <el-button class="jc-tabfilter-btns" type="primary" icon="el-icon-plus" size="small" @click="manage(null)">问题反馈</el-button>
        </template> -->
      </tab-filter>
      <el-card class="jc-table-card jc-mt">
        <div slot="header" class="jc-card-header">
          <div class="jc-card-title">列表内容</div>
        </div>
        <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
          <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
          <el-table-column prop="problemTitle" label="问题标题"></el-table-column>
          <el-table-column prop="carNumber" label="车牌号"></el-table-column>
          <el-table-column prop="userName" label="反馈人"></el-table-column>
          <el-table-column prop="dregsProblemTypeName" label="问题类型"></el-table-column>
          <el-table-column prop="problemDesc" label="问题描述" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-html="scope.row.problemDesc"></div>
            </template>
          </el-table-column>
          <el-table-column prop="statusName" label="状态"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" width="140"></el-table-column>
          <el-table-column width="90" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-view" @click="handle(scope.row,false)" title="查看" v-if="filter.selectType===QUESTION_TYPES.PROCESSED||filter.selectType===QUESTION_TYPES.FEEDBACK"></el-button>
              <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" v-if="filter.selectType===QUESTION_TYPES.DEAFT" title="编辑"></el-button>
              <el-button type="text" size="mini" icon="el-icon-document" @click="handle(scope.row,true)" title="处理" v-if="filter.selectType===QUESTION_TYPES.PENDING"></el-button>
              <el-button type="text" size="mini" icon="el-icon-arrow-down" @click="startTask(scope.row)" title="反馈" v-if="filter.selectType===QUESTION_TYPES.DEAFT"></el-button>
              <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除" v-if="filter.selectType!==QUESTION_TYPES.PENDING"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
      </el-card>
    </div>

    <jc-detail v-show="detailShow" :types="types" :info="info" :orgTree="orgTree" :user="user" :firstOrgIds="firstOrgIds" :detailShow.sync="detailShow" @save-success="initData"></jc-detail>

  </div>
</template>
<script>
import { questionList, questionDel, questionStart, questionGet } from '@/api/question'
import { getByType } from '@/api/supervise'
import { QUESTION_TYPES } from '@/constant/Dictionaries'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'QuestionProcessIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('./modules/detail')
  },
  data() {
    return {
      orgTree: [],
      list: [],
      loading: false,
      visible: false,
      info: null,
      QUESTION_TYPES,
      filter: {
        selectType: QUESTION_TYPES.PENDING
      },
      orgId: '',
      firstOrgIds: [],
      detailShow: false,
      types: [] // 问题类型
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
    async getOrgTree() {
      const res = await organizationList()

      this.orgTree = this.formatOrgTree(res)
      this.firstOrgIds = res.map(item=>item.orgId)
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await questionList({ systemModuleType: 1, ...this.filter, ...this.page })

          this.types = await getByType({ type: 'problemType' })
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
    del(row) {
      this.$confirm('确认删除该问题', '提示', { type: 'warning' }).then(() => {
        this.remove(row.businessKey)
      }).catch(() => {})
    },
    async remove(id) {
      try {
        await questionDel(id)
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      } catch (error) {
        console.error(error)
      }
    },
    //添加 编辑
    async manage(row) {
      if (row) {
        this.info = await questionGet(row.businessKey)
      } else {
        this.info = null
      }
      this.orgId = this.user.orgId
      this.visible = true
    },
    //问题反馈
    startTask(row) {
      this.$confirm('确认反馈该问题', '提示', { type: 'warning' }).then(async () => {
        try {
          await questionStart(row.businessKey)
          this.$message.success('反馈成功')
          this.initData()
        } catch (e) {
          console.error(e)
        }
      }).catch(() => {})
    },
    //handle   true处理问题  false 查看问题
    async handle(row, handle) {
      this.info = await questionGet(row.businessKey)
      this.info.taskId = row.taskId
      this.info.handle = handle
      this.orgId = this.user.orgId
      this.detailShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
