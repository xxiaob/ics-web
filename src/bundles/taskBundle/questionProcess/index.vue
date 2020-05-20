<template>
  <div class="jc-main-container-warp">
    <div v-show="!detailShow">
      <tab-filter :types="types" @filter="goFilter">
        <template v-slot:manage>
          <el-button class="jc-tabfilter-btns" type="primary" icon="el-icon-plus" size="small" @click="manage(null)">问题反馈</el-button>
        </template>
      </tab-filter>
      <el-card class="jc-table-card jc-mt">
        <div slot="header" class="jc-card-header">
          <div class="jc-card-title">列表内容</div>
        </div>
        <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="problemType" label="问题类型" :formatter="formatType"></el-table-column>
          <el-table-column prop="userName" label="反馈人"></el-table-column>
          <el-table-column prop="orgName" label="所属组织"></el-table-column>
          <el-table-column prop="problemTitle" label="标题"></el-table-column>
          <el-table-column prop="statusName" label="状态"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" width="140"></el-table-column>
          <el-table-column width="90" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-view" @click="handle(scope.row,false)" title="查看" v-if="filter.selectType===QUESTION_TYPES.PROCESSED||filter.selectType===QUESTION_TYPES.FEEDBACK"></el-button>
              <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" v-if="filter.selectType===QUESTION_TYPES.DEAFT" title="编辑"></el-button>
              <el-button type="text" size="mini" icon="el-icon-refresh-right" @click="handle(scope.row,true)" title="处理" v-if="filter.selectType===QUESTION_TYPES.PENDING"></el-button>
              <el-button type="text" size="mini" icon="el-icon-arrow-down" @click="startTask(scope.row)" title="反馈" v-if="filter.selectType===QUESTION_TYPES.DEAFT"></el-button>
              <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除" v-if="filter.selectType!==QUESTION_TYPES.PENDING"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
      </el-card>
    </div>
    <el-card class="jc-table-card" v-show="detailShow">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">{{info&&info.handle?'处理问题':'问题详情'}}</div>
        <div class="jc-button-group">
          <el-button size="small" icon="el-icon-arrow-left" @click="detailShow=false">返回</el-button>
        </div>
      </div>
      <jc-detail :types="types" :info="info" :firstOrgIds="firstOrgIds" :detailShow.sync="detailShow" @save-success="initData"></jc-detail>
    </el-card>

    <jc-manage :types="types" :orgTree="orgTree" :orgId="orgId" :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import { questionList, questionDel, questionStart, questionGet, questionTypeList } from '@/api/question'
import { QUESTION_TYPES } from '@/constant/Dictionaries'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'TaskQuestionProcessIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage'),
    JcDetail: () => import('./modules/detail')
  },
  data() {
    return {
      types: [],
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
      detailShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async created() {
    await this.getOrgTree()
    this.types = await questionTypeList() || []
    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    formatType(row, column, cellValue) {
      const type = this.types.filter(item=>item.id == cellValue)

      return (type[0] && type[0].typeName) || ''
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
          const { total, resultList } = await questionList({ ...this.filter, ...this.page })

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
      this.detailShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
