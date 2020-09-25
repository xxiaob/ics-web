<template>
  <div class="jc-main-full-container">
    <tab-filter @filter="goFilter"></tab-filter>
    <div class="jc-flex jc-mt">
      <el-card class="jc-table-card jc-flex-left">
        <div slot="header" class="jc-card-header">
          <div class="jc-card-title">群组列表</div>
          <div class="jc-button-group">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="manage(null)" title="添加群组"></el-button>
          </div>
        </div>
        <ul class="group-list">
          <li v-for="item in list" :key="item.groupId" :class="{active:item.groupId===activeGroupId}" @click="changeGroup(item.groupId)">
            <span class="name" :title="item.groupName">{{item.groupName}}</span>
            <span class="right">
              <el-button type="text" size="mini" icon="el-icon-edit-outline" @click.stop="manage(item)" title="编辑"></el-button>
              <el-button type="text" size="mini" icon="el-icon-delete" @click.stop="delGroup(item)" title="删除"></el-button>
            </span>
          </li>
        </ul>
      </el-card>
      <el-card class="jc-table-card jc-flex-right">
        <div slot="header" class="jc-card-header">
          <div class="jc-card-title">用户列表</div>
          <div class="jc-button-group">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="userVisible=true">添加用户</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeAll">删除用户</el-button>
          </div>
        </div>
        <el-table :data="userList" v-loading="loading" row-key="id" class="jc-table" @selection-change="tableSelect">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
          <el-table-column prop="orgName" label="组织名称"></el-table-column>
          <el-table-column prop="userName" label="用户名称"></el-table-column>
          <el-table-column width="100" label="操作">
            <template slot-scope="scope">
              <el-button :loading="loading" type="text" size="mini" icon="el-icon-view" @click="seeCode(scope.row)" title="查看二维码"></el-button>
              <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row)" title="删除"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>

      </el-card>
    </div>

    <jc-manage :options="info" :visible.sync="visible" @save-success="getGroups"></jc-manage>

    <jc-user-manage :groupId="activeGroupId" :visible.sync="userVisible" @save-success="initData"></jc-user-manage>

    <el-dialog title="二维码" :visible.sync="codeVisible" width="300px" :close-on-click-modal="false" :append-to-body="true" top="30vh">
      <img :src="codeUrl" width="100%" />
    </el-dialog>
  </div>
</template>
<script>
import { pttGroupList, pttGroupDel, getUserList, userDel, userCode } from '@/api/pttGroup'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import QRCode from 'qrcode'

export default {
  name: 'SystemPttGroupIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcManage: () => import('./modules/manage'),
    JcUserManage: () => import('./modules/userManage')
  },
  data() {
    return {
      codeUrl: '',
      codeVisible: false,
      activeGroupId: '',
      list: [],
      userList: [],
      loading: false,
      visible: false,
      userVisible: false,
      info: null,
      ids: [],
      filter: {}
    }
  },
  created() {
    this.getGroups()
  },
  methods: {
    changeGroup(groupId) {
      if (this.activeGroupId !== groupId) {
        this.activeGroupId = groupId
        this.initData()
      }
    },
    async initData() {
      this.loading = true
      const { total, resultList } = await getUserList({ groupId: this.activeGroupId, ...this.page })

      this.page.total = total
      this.userList = resultList
      // this.userList = new Array(50).fill('1')
      this.loading = false
    },
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    formatUser(row, column, cellValue) {
      const users = cellValue.map(item=>item.userName)

      return users.join('、')
    },
    async getGroups() {
      // if (!this.loading) {
      // }
      this.loading = true
      try {
        // this.list = new Array(50).fill('1')
        this.list = await pttGroupList({ ...this.filter })

        this.loading = false
        if (this.list.length) {
          this.changeGroup(this.list[0].groupId)
        }
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },
    goFilter(filter) {
      this.filter = filter
      this.getGroups()
    },
    tableSelect(selections) {
      let ids = []

      if (selections && selections.length) {
        selections.forEach(item=> {
          ids.push(item.channelUserId)
        })
      }
      this.ids = ids
    },
    delGroup(row) {
      this.$confirm('确认删除该群组', '提示', { type: 'warning' }).then(() => {
        pttGroupDel(row.groupId).then(() => {
          this.$message.success('删除成功')
          this.getGroups()
        })
      }).catch(() => {})
    },
    del(row) {
      this.$confirm('确认删除该用户', '提示', { type: 'warning' }).then(() => {
        this.remove([row.channelUserId])
      }).catch(() => {})
    },
    //生成二维码
    async seeCode(row) {
      this.loading = true
      const res = await userCode(row.userId)

      console.log(res)
      this.codeUrl = await QRCode.toDataURL(res.code, {
        width: 256,
        height: 256
      })
      this.loading = false
      this.codeVisible = true
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
    remove(channelUserIds) {
      this.loading = true
      userDel({ channelUserIds, groupId: this.activeGroupId }).then(() => {
        this.$message.success('删除成功')
        this.currentChange(this.page.pageNum - 1)
        this.loading = false
      })
    },
    manage(row) {
      this.info = row
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin auto-el-card__body {
  display: flex;
  flex-direction: column;

  /deep/ .el-card__body {
    flex: 1;
    overflow: auto;
  }
}

.jc-main-full-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.jc-flex {
  display: flex;
  flex: 1;
  // height: 100%;
  overflow: hidden;
  .jc-flex-left {
    width: 240px;
    margin-right: 20px;
    @include auto-el-card__body;
  }
  .jc-flex-right {
    flex: 1;
    @include auto-el-card__body;
  }
}
.group-list {
  list-style: none;
  li {
    padding: 5px;
    cursor: pointer;
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      width: 150px;
    }
    .right {
      float: right;
      .el-button--mini {
        padding: 0;
      }
      .el-button + .el-button {
        margin: 0;
      }
    }
  }
  .active {
    background-color: #f0f7ff;
  }
}
</style>
