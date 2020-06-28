<template>
  <div class="jc-main-container-warp">
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="manage(null)">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="removeAll">删除</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="areaTypeId" class="jc-table" @selection-change="tableSelect">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="icon" label="区域类型图标">
          <template slot-scope="scope">
            <i class="jc-area-icon" :style="getIconStyle(scope.row.icon)"></i>
          </template>
        </el-table-column>
        <el-table-column prop="areaTypeName" label="区域类型名称"></el-table-column>
        <el-table-column prop="createTime" label="添加时间"></el-table-column>
        <el-table-column width="60" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" title="编辑"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
    <jc-manage :options="info" :visible.sync="visible" @save-success="initData"></jc-manage>
  </div>
</template>
<script>
import { areaTypeListByPage, areaTypeDel } from '@/api/areaType'
import PaginationMixins from '@/mixins/PaginationMixins'
import { formatDate } from '@/libs/util'
import { JcIcons } from '@/config/JcIconConfig'

export default {
  name: 'SystemAreaTypeIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage')
  },
  data() {
    return {
      list: [],
      loading: false,
      visible: false,
      info: null,
      ids: [],
      filter: {}
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      if (this.loading) {
        return false
      }
      this.loading = true
      try {
        const { total, resultList } = await areaTypeListByPage({ ...this.filter, ...this.page })

        this.page.total = total

        let list = []

        if (resultList && resultList.length) {
          resultList.forEach(item => {
            list.push({ areaTypeId: item.areaTypeId, areaTypeName: item.areaTypeName, icon: item.icon, createTime: formatDate(item.createTime) })
          })
        }
        this.list = list
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    getIconStyle(icon) {
      let useIcon = JcIcons[icon] || {}

      return `background-image: url(${useIcon.icon || ''});`
    },
    goFilter(filter) {
      this.filter = { ...filter }
      this.currentChange(1)
    },
    tableSelect(selections) {
      let ids = []

      if (selections && selections.length) {
        selections.forEach(item=> {
          ids.push(item.areaTypeId)
        })
      }
      this.ids = ids
    },
    del(row) {
      this.$confirm('确认删除该区域类型', '提示', { type: 'warning' }).then(() => {
        this.remove([row.areaTypeId])
      }).catch(() => {})
    },
    removeAll() {
      if (this.ids.length) {
        this.$confirm('确认删除选中的区域类型', '提示', { type: 'warning' }).then(() => {
          this.remove(this.ids)
        }).catch(() => {})
      } else {
        this.$message.error('请先选择删除项')
      }
    },
    remove(ids) {
      areaTypeDel(ids).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    },
    manage(row) {
      this.info = row ? row : null
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-area-icon {
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto 0;
  width: 40px;
  height: 40px;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
