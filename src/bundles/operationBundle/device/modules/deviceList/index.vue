<template>
  <div>
    <tab-filter :orgTree="orgTree" @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" size="small" @click="batchOperate('setType')">设置 设备类型</el-button>
          <el-button type="primary" size="small" @click="batchOperate('setOrg')">设置 所属组织</el-button>
          <el-button type="primary" size="small" @click="batchOperate('clear')">清除设置</el-button>
          <el-button type="primary" size="small" @click="visible=true">新增设备</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="deviceId" class="jc-table" @selection-change="tableSelect">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="deviceName" label="设备名称"></el-table-column>
        <el-table-column prop="orgName" label="所属组织"></el-table-column>
        <el-table-column prop="deviceTypeName" label="设备类型"></el-table-column>
        <el-table-column prop="treatyType" label="接入协议" v-if="source==1"></el-table-column>
        <el-table-column prop="userName" label="绑定用户" v-if="source==2"></el-table-column>
        <el-table-column prop="location" label="经纬度" v-if="source==3"></el-table-column>
        <el-table-column prop="url" label="固定流地址" v-if="source==3"></el-table-column>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button  v-if="source==1" type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="详情"></el-button>
            <el-button  v-if="source!=3" type="text" size="mini" icon="el-icon-video-camera" @click="showVideo(scope.row)" title="视频记录"></el-button>
            <el-button v-if="source!=1" type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除"></el-button>
            <el-button v-if="source==2&&scope.row.orgId" type="text" size="mini" icon="el-icon-setting" @click="setUser(scope.row)" title="设置"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>

    <jc-manage :visible.sync="visible" @save-success="initData"></jc-manage>
    <jc-manage-user :options="info" :visible.sync="userVisible" @save-success="initData"></jc-manage-user>
    <jc-manage-type :options="{deviceIds}" :visible.sync="typeVisible" @save-success="initData"></jc-manage-type>
    <jc-manage-org :orgTree="orgTree" :options="{deviceIds}" :visible.sync="orgVisible" @save-success="initData"></jc-manage-org>

    <jc-detail :options="detailInfo" :visible.sync="detailVisible"></jc-detail>

  </div>
</template>
<script>
import { organizationList } from '@/api/organization'
import { deviceList, deviceDetail, bindRelease, deleteDevice } from '@/api/device'
import PaginationMixins from '@/mixins/PaginationMixins'

export default {
  name: 'SystemDeviceTable',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('../tabFilter'),
    JcManage: () => import('../manage'),
    JcManageUser: () => import('../manageUser'),
    JcManageType: () => import('../manageType'),
    JcManageOrg: () => import('../manageOrg'),
    JcDetail: () => import('../detail')
  },
  data() {
    return {
      source: 1,
      deviceIds: [],
      list: [],
      orgTree: [],
      loading: false,
      visible: false,
      userVisible: false,
      info: null,
      detailInfo: null,
      detailVisible: false,
      filter: {},
      typeVisible: false,
      orgVisible: false
    }
  },
  created() {
    organizationList().then(res => {
      this.orgTree = this.formatOrgTree(res)
    })
    // this.initData()
  },
  methods: {
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { total, data } = await deviceList({ ...this.filter, ...this.page })

          this.page.total = total
          this.list = data
          this.source = this.filter.source
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
    async detail({ deviceId }) {
      this.detailInfo = await deviceDetail({ deviceId })
      this.detailVisible = true
    },
    setUser(row) {
      this.info = row
      this.userVisible = true
    },
    async showVideo({ deviceId, userId }) {
      const type = userId ? 'law' : 'camera'
      const detail = await deviceDetail({ deviceId })

      this.$parent.checkShow(type, detail)
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
    tableSelect(selections) {
      let deviceIds = []

      if (selections && selections.length) {
        selections.forEach(item => {
          deviceIds.push(item.deviceId)
        })
      }
      this.deviceIds = deviceIds
    },
    //批量操作
    batchOperate(fn) {
      if (this.deviceIds.length) {
        this[fn]()
      } else {
        this.$message.error('请先选择设备')
      }
    },
    //设置 设备类型
    setType() {
      this.typeVisible = true
    },
    //设置 所属组织
    setOrg() {
      this.orgVisible = true
    },
    //清除设置
    clear() {
      this.$confirm('确认清除选中设备的设置', '提示', { type: 'warning' }).then(async () => {
        console.log('确定清除设置')
        try {
          await bindRelease({ deviceIds: this.deviceIds })
          this.$message.success('操作成功')
          this.initData()
        } catch (error) {
          console.error(error)
        }
      }).catch(() => {})
    },
    del(row) {
      this.$confirm('确认删除该设备', '提示', { type: 'warning' }).then(() => {
        this.remove(row.deviceId)
      }).catch(() => {})
    },
    remove(id) {
      deleteDevice(id).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    }
  }
}
</script>
