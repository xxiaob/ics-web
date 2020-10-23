<template>
  <el-dialog :title="'资源设置 | '+options.projectName" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <div class="jc-clearboth">
      <div class="jc-left-width48">
        <div class="jc-title">配置人员</div>
        <tree-select ref="userTree" type="user" :treesLoading="userTreesLoading" :trees="userTrees" :checkKeys="userCheckKeys" ></tree-select>
      </div>
      <div class="jc-right-width48">
        <div class="jc-title">配置设备</div>
        <tree-select ref="deviceTree" type="device" :treesLoading="deviceTreesLoading" :trees="deviceTrees" :checkKeys="deviceCheckKeys" ></tree-select>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getOrgUserList, getOrgDeviceTree } from '@/api/user'
import { deviceBindProject } from '@/api/device'
import { projectUserRefList, projectUserRefSave } from '@/api/projects'
import treeSelect from './components/treeSelect'

export default {
  name: 'ProjectProjectSettingResource',
  props: ['options', 'visible'],
  components: { treeSelect },
  data() {
    return {
      dialogVisible: false,
      loading: false,

      userTreesLoading: false,
      userTrees: [],
      userCheckKeys: [],

      deviceTreesLoading: false,
      deviceTrees: [],
      deviceCheckKeys: []
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initData()
      }
    }
  },
  methods: {
    initData() {
      this.dialogVisible = this.visible
      this.getUsers()
      this.getDevices()
    },
    async getUsers() {
      this.userTrees = []
      this.userCheckKeys = []
      this.userTreesLoading = true
      try {
        const orgsAndUsers = await getOrgUserList()

        this.userTrees = this.formatUserOrgTrees(orgsAndUsers)//处理组织和用户

        //处理原有用户显示
        const checkUsers = await projectUserRefList({ projectId: this.options.projectId })

        if (checkUsers && checkUsers.length) {
          this.userCheckKeys = checkUsers.map(item =>item.userId)
        }
      } catch (error) {
        console.log(error)
      }
      this.userTreesLoading = false
    },
    formatUserOrgTrees(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = { id: item.orgId, label: item.orgName, pid: item.pid, type: 'org' }

          let nodeChildren = this.formatUserOrgTrees(item.children)

          //处理用户 userRespDTOList
          if (item.userRespDTOList && item.userRespDTOList.length) {
            item.userRespDTOList.forEach(user => {
              nodeChildren.push({ id: user.userId, label: user.userName, pid: user.orgId, type: 'user' })
            })
          }
          trees.push(nodeChildren && nodeChildren.length ? { ...node, children: nodeChildren } : node)
        })
      }
      return trees
    },
    async getDevices() {
      this.deviceTrees = []
      this.deviceCheckKeys = []
      this.deviceTreesLoading = true
      try {
        const orgsAndDevice = await getOrgDeviceTree(this.options.projectId)

        this.deviceTrees = this.formatDeviceOrgTrees([orgsAndDevice])
      } catch (err) {
        console.log(err)
      }
      this.deviceTreesLoading = false
    },
    formatDeviceOrgTrees(child) {
      // 处理数据
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = { id: item.orgId, label: item.orgName, type: 'org' }

          let nodeChildren = this.formatDeviceOrgTrees(item.orgList)

          if (item.deviceList && item.deviceList.length) {
            item.deviceList.forEach(device => {
              if (device.flag) {
                this.deviceCheckKeys.push(device.deviceId)
              }
              nodeChildren.push({ id: device.deviceId, label: device.deviceName, type: 'device', deviceType: device.type })
            })
          }
          trees.push(nodeChildren && nodeChildren.length ? { ...node, children: nodeChildren } : node)
        })
      }

      return trees
    },
    async onSubmit() {
      this.loading = true
      const { addIds: addUserIds, deleteIds: deleteUserIds } = this.$refs.userTree.getResult()
      const { addIds: addDeviceIds, deleteIds: deleteDeviceIds } = this.$refs.deviceTree.getResult()

      try {
        await projectUserRefSave({ addUserIds, deleteUserIds, projectId: this.options.projectId })
        await deviceBindProject({ addDeviceIds, deleteDeviceIds, projectId: this.options.projectId })
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.$emit('save-success')
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    dialogClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-clearboth::after,
.jc-clearboth::before {
  content: "";
  display: table;
  clear: both;
}
.jc-left-width48 {
  width: 48%;
  float: left;
}
.jc-right-width48{
  width: 48%;
  float: right;
}
.jc-title{
  text-align: center;
  line-height: 28px;
}
</style>
