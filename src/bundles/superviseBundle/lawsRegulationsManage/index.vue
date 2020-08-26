<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>

    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group jc-flex-warp">
          <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload" :show-file-list="false">
            <el-button size="small" type="primary">导入</el-button>
          </el-upload>
          <el-button type="primary" size="small" @click="manage(null)">新增</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="one" label="法规类型"></el-table-column>
        <el-table-column prop="one" label="文件名称"></el-table-column>
        <el-table-column prop="one" label="创建人"></el-table-column>
        <el-table-column prop="one" label="创建时间" width="140"></el-table-column>
        <el-table-column prop="one" label="法规描述"></el-table-column>
        <el-table-column width="90" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button>
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage('scope.row')" title="编辑"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>

    <jc-manage :options="info" :visible.sync="visible"></jc-manage>

    <!-- 详情 -->
    <jc-Laws-detail :info="info" :visible.sync="detailVisible"></jc-Laws-detail>
  </div>
</template>

<script>
import PaginationMixins from '@/mixins/PaginationMixins'
export default {
  name: 'superviseLawsAndRegulationsManage',
  mixins: [PaginationMixins],
  data() {
    return {
      loading: false,
      list: [{
        one: 202341000,
        two: 202341000,
        three: 202341000,
        four: 202341000,
        five: 202341000,
        six: 202341000,
        seven: 202341000,
        eight: 202341000
      }],
      filter: {},
      info: null,
      visible: false,
      detailVisible: false
    }
  },
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage'),
    JcLawsDetail: () => import('./modules/detail')
  },
  methods: {
    goFilter() {},
    manage(row) {
      // 新增弹窗
      if (row) {
        // 如果row有值为编辑
        // 发送请求获取数据, 将数据复制给info
        // this.info = res
        this.info = {
          one: 202341000,
          two: 202341000,
          three: 202341000,
          four: 202341000,
          five: 202341000,
          six: 202341000,
          seven: 202341000,
          eight: 202341000
        }
        this.visible = true
      } else {
        // 新增
        this.info = null
        this.visible = true
      }
    },
    detail(row) {
      // 查看详情
      this.info = {
        one: 202341000,
        two: 202341000,
        three: 202341000,
        four: 202341000,
        five: 202341000,
        six: 202341000,
        seven: 202341000,
        eight: 202341000
      }
      this.detailVisible = true
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
        return Promise.resolve()
      })
    },
    uploadSuccess() {
      // 上传成功函数
      console.log('上传成功')
    },
    uploadError() {
      // 上传失败函数
      console.log('上传失败')
    }
  }

}
</script>

<style lang="scss" scoped>
.upload-demo {
  margin-right: 10px;
}
</style>
