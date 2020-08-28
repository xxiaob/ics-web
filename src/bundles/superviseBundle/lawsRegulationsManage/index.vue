<template>
  <div class="jc-main-container-warp">
    <tab-filter :types="types" @filter="goFilter"></tab-filter>

    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group jc-flex-warp">
          <el-upload class="upload-demo" :action="uploadUrl" :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list="false" :headers="uploadHeaders">
            <el-button size="small" type="primary">导入</el-button>
          </el-upload>
          <el-button type="primary" size="small" @click="manage(null)">新增</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="statuteTypeName" label="法规类型" width="120"></el-table-column>
        <el-table-column prop="statuteName" label="文件名称" width="120"></el-table-column>
        <el-table-column prop="userName" label="创建人" width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="140" :formatter="formatDate"></el-table-column>
        <el-table-column label="法规描述">
          <template slot-scope="scope">
            <span class="desc" v-text="scope.row.statuteDesc" :title="scope.row.statuteDesc"></span>
          </template>
        </el-table-column>
        <el-table-column width="90" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button>
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" title="编辑"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>

    <jc-manage :types="types" :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>

    <!-- 详情 -->
    <jc-Laws-detail :info="info" :visible.sync="detailVisible"></jc-Laws-detail>
  </div>
</template>

<script>
import PaginationMixins from '@/mixins/PaginationMixins'
import { getByType, getStatuteList, statuteDel } from '@/api/supervise'
import { LAWS_TYPES } from '@/constant/Dictionaries'
import API from '@/api/API'
import { getToken } from '@/libs/storage'
import { formatDate } from '@/libs/util'


export default {
  name: 'superviseLawsAndRegulationsManage',
  mixins: [PaginationMixins],
  data() {
    return {
      loading: false,
      uploadUrl: process.env.apiHostConfig.base + API.supervise.import,
      uploadHeaders: { token: getToken() },
      list: [],
      filter: {},
      info: null,
      visible: false,
      detailVisible: false,
      types: []
    }
  },
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage'),
    JcLawsDetail: () => import('./modules/detail')
  },
  mounted() {
    this.getStatuteTypes()
    this.initData()
  },
  methods: {
    async initData() {
      // 初始获取数据
      if (!this.loading) {
        this.loading = true
        try {
          let filter = this.filter

          Object.keys(filter).map(key => {
            if (!filter[key]) {
              delete filter[key]
            }
          })
          const { total, resultList } = await getStatuteList({ ...filter, ...this.page })

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
      this.types = await getByType({ type: LAWS_TYPES.STATUTE }) // 获取法规类型
    },
    formatDate(row) {
      return formatDate(row.createTime)
    },
    goFilter(filter) {
      this.filter = filter // 获取查询信息
      this.currentChange(1)
    },
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
      this.info = row
      this.detailVisible = true
    },
    del(row) {
      // 删除法规
      this.$confirm('确认删除该法规', '提示', { type: 'warning' }).then(() => {
        this.remove(row.id)
      }).catch(() => {})
    },
    remove(ids) {
      // 处理删除信息的路径
      statuteDel({ id: ids }).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    },
    beforeUpload() {
      // 文件上传前弹窗

      return this.$confirm('若法规已存在，则覆盖，是否确认上传?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '上传完成!'
        })
        this.loading = true
        return true
      })
    },
    uploadSuccess() {
      // 上传成功函数
      this.loading = false
      this.initData()
    }
  }

}
</script>

<style lang="scss" scoped>
.upload-demo {
  margin-right: 10px;
}
.desc {
  @include jc-text-warp(4);
  width: 100%;
}
</style>
