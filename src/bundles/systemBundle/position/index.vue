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
      <el-table :data="list" v-loading="loading" row-key="positionId" class="jc-table" @selection-change="tableSelect">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="positionName" label="职位名称"></el-table-column>
        <el-table-column label="电脑端">
          <template slot-scope="scope">
            <i class="jc-position-status" :class="{'jc-status-on': scope.row.pc}"></i>
          </template>
        </el-table-column>
        <el-table-column label="移动端">
          <template slot-scope="scope">
            <i class="jc-position-status" :class="{'jc-status-on': scope.row.mobile}"></i>
          </template>
        </el-table-column>
        <el-table-column label="行政执法仪">
          <template slot-scope="scope">
            <i class="jc-position-status jc-law" :class="{'jc-status-on': scope.row.law}"></i>
          </template>
        </el-table-column>
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
import PaginationMixins from '@/mixins/PaginationMixins'
import { positionList, positionDel } from '@/api/position'
import { formatDate } from '@/libs/util'
import { LOGIN_DEVICE_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'SystemPositionIndex',
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
    initData() {
      if (!this.loading) {
        this.loading = true
        positionList({ ...this.filter, ...this.page }).then(res => {
          this.page.total = res.total

          let list = []

          if (res.resultList && res.resultList.length) {
            res.resultList.forEach(item => {
              let type = item.loginType ? item.loginType.split(',') : []

              let media = item.mobileFunction ? item.mobileFunction.split(',') : []

              list.push({ positionId: item.positionId, type, media, ...this.getDeviceStatusClass(item.loginType), positionName: item.positionName, createTime: formatDate(item.createTime) })
            })
          }
          this.list = list
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    getDeviceStatusClass(loginType) {
      if (loginType) {
        return {
          pc: loginType.includes(LOGIN_DEVICE_TYPES.PC),
          mobile: loginType.includes(LOGIN_DEVICE_TYPES.MOBILE),
          law: loginType.includes(LOGIN_DEVICE_TYPES.LAW)
        }
      }
      return { pc: '', mobile: '', law: '' }
    },
    goFilter(filter) {
      this.filter = { ...filter }
      this.currentChange(1)
    },
    tableSelect(selections) {
      let ids = []

      if (selections && selections.length) {
        selections.forEach(item => {
          ids.push(item.positionId)
        })
      }
      this.ids = ids
    },
    del(row) {
      this.$confirm('确认删除该职位', '提示', { type: 'warning' }).then(() => {
        this.remove([row.positionId])
      }).catch(() => { })
    },
    removeAll() {
      if (this.ids.length) {
        this.$confirm('确认删除选中的职位', '提示', { type: 'warning' }).then(() => {
          this.remove(this.ids)
        }).catch(() => { })
      } else {
        this.$message.error('请先选择删除项')
      }
    },
    remove(ids) {
      positionDel(ids).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    },
    manage(row) {
      if (row) {
        this.info = row
        this.visible = true
      } else {
        this.info = null
        this.visible = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-position-status {
  display: block;
  width: 36px;
  height: 16px;
  background: url(./assets/off.png) no-repeat center;
  background-size: auto 100%;
  &.jc-law {
    width: 60px;
  }
  &.jc-status-on {
    background-image: url(./assets/on.png);
  }
}
</style>
