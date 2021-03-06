<template>
  <div>
    <tab-filter @filter="goFilter"></tab-filter>
    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="manage(null)">添加</el-button>
          <el-button type="primary" icon="el-icon-upload2" size="small" @click="usersVisible=true">批量人员</el-button>
          <el-button type="primary" icon="el-icon-upload2" size="small" @click="photosVisible=true">批量照片</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="removeAll">删除</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="userId" class="jc-table" @selection-change="tableSelect">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="userName" label="用户名称"></el-table-column>
        <el-table-column prop="account" label="登录账号"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="orgName" label="所属组织"></el-table-column>
        <el-table-column prop="positions" label="职位" :formatter="formatPostions"></el-table-column>
        <el-table-column label="默认接收人">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isDefReceiver" active-value="1" inactive-value="0" @change="userStateChange(scope.row,1)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="默认接警人">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isDefUploadReceiver" active-value="1" inactive-value="0" @change="userStateChange(scope.row,2)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="manage(scope.row)" title="编辑"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除"></el-button>
            <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看详情"></el-button>
            <el-button type="text" size="mini" icon="el-icon-refresh" @click="reset(scope.row)" title="重置密码"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>
    <jc-manage :options="info" :orgId="org.orgId" :visible.sync="visible" @save-success="initData"></jc-manage>
    <jc-manage-photos :visible.sync="photosVisible"></jc-manage-photos>
    <jc-manage-users :orgId="org.orgId" :visible.sync="usersVisible" @save-success="initData"></jc-manage-users>
    <user-detail :userId="userId" :visible.sync="detailVisible"></user-detail>
  </div>
</template>
<script>
import { userList, userDel, updateOrgReceiver, resetUserPwd, userGet } from '@/api/user'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'

export default {
  name: 'SystemUserTable',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('../tabFilter'),
    JcManage: () => import('../manage'),
    JcManagePhotos: () => import('../managePhotos'),
    JcManageUsers: () => import('../manageUsers'),
    UserDetail: () => import('../detail')
  },
  data() {
    return {
      list: [],
      loading: false,
      visible: false,
      detailVisible: false,
      photosVisible: false,
      usersVisible: false,
      info: null,
      userId: null,
      org: {},
      ids: [],
      filter: {}
    }
  },
  methods: {
    formatPostions(row, column, cellValue) {
      const positionNames = cellValue.map(item=>item.positionName)

      return positionNames.join(',')
    },
    async initData(org) {
      if (org) {
        this.org = org
      }
      if (!this.loading) {
        this.loading = true
        try {
          const res = await userList({ ...this.filter, ...this.page, orgId: this.org.orgId })

          this.page.total = res.total

          let list = []

          if (res.resultList && res.resultList.length) {
            res.resultList.forEach(item => {
              list.push({ ...item, isDefReceiver: item.isDefReceiver + '', isDefUploadReceiver: item.isDefUploadReceiver + '', createTime: formatDate(item.createTime) })
            })
          }
          this.list = list
        } catch (error) {
          console.error(error)
        }
        this.loading = false
        // userList({ ...this.filter, ...this.page, orgId: this.org.orgId }).then(res => {
        //   this.loading = false
        // }).catch(() => {
        //   this.loading = false
        // })
      }
    },
    goFilter(filter) {
      this.filter = filter
      this.currentChange(1)
    },
    tableSelect(selections) {
      let ids = []

      if (selections && selections.length) {
        selections.forEach(item=> {
          ids.push(item.userId)
        })
      }
      this.ids = ids
    },
    del(row) {
      this.$confirm('确认删除该用户', '提示', { type: 'warning' }).then(() => {
        this.remove([row.userId])
      }).catch(() => {})
    },
    removeAll() {
      if (this.ids.length) {
        this.$confirm('确认删除选中的用户', '提示', { type: 'warning' }).then(() => {
          this.remove(this.ids)
        }).catch(() => {})
      } else {
        this.$message.error('请先选择删除项')
      }
    },
    remove(ids) {
      userDel(ids).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
      })
    },
    userStateChange(row, type) {
      let key = type == 1 ? 'isDefReceiver' : 'isDefUploadReceiver'

      let changeName = type == 1 ? '默认接收人' : '默认接警人'

      let tip = row[key] == 1 ? '设置' : '取消'

      this.$confirm(`确认${tip}用户  <span class="jc-link">${row.userName}</span> 为组织 <span class="jc-link">${this.org.orgName}</span> 的${changeName}`, '提示', { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
        updateOrgReceiver({ userId: row.userId, orgId: this.org.orgId, isDefReceiver: row.isDefReceiver, isDefUploadReceiver: row.isDefUploadReceiver }).then(() => {
          this.$message.success('设置成功')
        }).catch(() => {
          row[key] = row[key] == 1 ? '0' : '1'
        })
      }).catch(() => {
        row[key] = row[key] == 1 ? '0' : '1'
      })
    },
    reset(row) {
      this.$confirm(`确认重置用户 <span class="jc-link">${row.userName}</span> 的密码`, '提示', { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
        resetUserPwd(row.userId).then(() => {
          this.$message.success('重置成功')
        })
      }).catch(() => {})
    },
    detail(row) {
      this.userId = row.userId
      this.detailVisible = true
    },
    manage(row) {
      if (row) {
        userGet({ userId: row.userId, orgId: this.org.orgId }).then(res => {
          if (res.roles && res.roles.length) {
            let roleIds = []

            res.roles.forEach(item => {
              roleIds.push(item.roleId)
            })
            res.roleIds = roleIds
          }
          if (res.positions && res.positions.length) {
            let positionIds = []

            res.positions.forEach(item => {
              positionIds.push(item.positionId)
            })
            res.positionIds = positionIds
          }
          this.info = res
          this.visible = true
        })
      } else {
        this.info = null
        this.visible = true
      }
    },
    uploadPhoto() {
      console.log('uploadPhoto')
    }
  }
}
</script>
