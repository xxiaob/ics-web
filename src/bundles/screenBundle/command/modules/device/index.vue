<template>
  <view-warp title="组织设备">
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-view-content" v-loading="loading">
      <el-tree ref="tree" :default-expanded-keys="expandedKeys" :data="trees" :props="props" :show-checkbox="true" node-key="id" :filter-node-method="filterNode" @check="checkChange">
        <div class="custom-tree-node" slot-scope="{ node,data}">
          <div class="jc-tree-label no-select jc-flex-warp" :class="{'jc-devices-offline': data.type=='device' && !data.online, 'jc-device':data.type=='device'}">
            <i class="iconfont" :class="{'iconshexiangtou':data.deviceType==DEVICE_TYPES.CAMERA,'iconwurenji':data.deviceType==DEVICE_TYPES.UAV,'iconmap_policecar':data.deviceType==DEVICE_TYPES,'online':data.online}" v-if="data.type=='device'"></i>
            <div class="jc-text-warp.NETPATROLCAR" v-text="node.label" :title="node.label"></div>
          </div>
          <div class="jc-tree-options" v-on:click.stop>
            <el-button type="text" size="small" icon="el-icon-map-location" :class="{'jc-devices-offline': data.type=='device' && !data.online}" @click="goLocation(data)" title="定位"></el-button>
            <el-button type="text" size="small" icon="el-icon-view" :class="{'jc-devices-offline': data.type=='device' && !data.online}" v-if="data.type=='device'" @click="deviceDetail(data)" title="详情"></el-button>
          </div>
        </div>
      </el-tree>
    </div>
    <div class="jc-user-warp">
      <div class="jc-user-header">
        已选设备
      </div>
      <div class="jc-user-content">
        <div class="jc-user-item" v-for="(device,index) in devices" :key="device.id">
          {{device.name}}
          <i class="el-icon-close" @click="deleteDevice(index)"></i>
        </div>
      </div>
      <div class="jc-user-footer">
        <div class="jc-opera-item" @click="clearDevices">清除</div>
        <div class="jc-opera-item" @click="devicevideoPlay">多屏视频</div>
      </div>
    </div>
  </view-warp>
</template>
<script>
import { getDeviceList } from '@/api/device'
import TreesFilterMixins from '@/mixins/TreesFilterMixins'
import { DEVICE_TYPES } from '@/constant/Dictionaries'

// import { VIDEO_INVITE_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'ScreenCommandOrg',
  mixins: [TreesFilterMixins],
  props: ['options', 'project'],
  components: {
    ViewWarp: () => import('../common/viewWarp')
  },
  watch: {
    filterText(val) {
      this.filter(val)
    },
    options() {
      this.initOptionsUsers() //初始化传入的用户
    }
  },
  data() {
    return {
      loading: false,
      devices: [],
      filterText: '',
      trees: [],
      expandedKeys: [],
      props: { children: 'children', label: 'label' },
      checkKeys: [],
      onlineDevices: [],
      DEVICE_TYPES: DEVICE_TYPES
    }
  },
  created() {
    this.initData()
    // this.$EventBus.$on('map-device-online-change', this.onlineDevicesChange) //监听在线设备变化
    this.$EventBus.$on('map-device-change', this.onlineDevicesChange)
  },
  methods: {
    onlineDevicesChange(onlineDevices) {
      console.log('onlineDevicesChange', onlineDevices)
      console.log('devices', this.trees)

      if (onlineDevices.type == 2) {
        // type 2  为推送在线
        onlineDevices.devices.forEach(device => {
          if (!this.onlineDevices.includes(device.deviceId)) {
            this.onlineDevices.push(device.deviceId) // 新增在线id
          }
        })
        console.log('online', this.onlineDevices)
      } else if (onlineDevices.type == 3) {
        // type 3 为推送 离线
        onlineDevices.deviceIds.forEach(device => {
          let index = this.onlineDevices.findIndex(onlineId => onlineId == device ) // 查询离线索引

          this.onlineDevices.splice(index, 1) // 删除离线id
        })
      }

      this.trees = this.onlineChange(this.trees) // 调用方法从新处理数据
      console.log('this.trees', this.trees)
    },
    onlineChange(trees) {
      // 处理离线/在线切换的方法
      return trees.map(item => {
        if (item.type == 'org') {
          return {
            ...item,
            children: item.children && this.onlineChange(item.children)
          }
        } else {
          if (this.onlineDevices.includes(item.id)) {
            return {
              ...item,
              online: true,
              disabled: false
            }
          } else {
            return {
              ...item,
              online: false,
              disabled: true
            }
          }
        }
      })
    },
    async initData() {
      // 初始数据
      this.loading = true
      try {
        const orgsAndDevice = await getDeviceList({ projectId: this.project.projectId })

        console.log('orgsAndUsers', orgsAndDevice)

        this.trees = this.formatDeviceOrgTrees(orgsAndDevice) // 处理组织和用户
        this.expandedKeys = this.trees.length ? [this.trees[0].id] : [] // 设置第一级默认展开

        this.initOptionsUsers() // 初始传入的用户
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    initOptionsUsers() {
      console.log('deviceInitOptions', this.options)
      if (this.options && this.options.lenght) {
        // 如果传入option有选中
        let checkKeys = this.$refs.tree.getCheckedKeys()

        this.$refs.tree.setCheckedKeys([...checkKeys, ...this.options])
        this.$nextTick(() => {
          this.checkChange() // 去设置用户
        })
      }
    },
    deleteDevice(index) {
      this.devices.splice(index, 1) // 删除用户
      this.updateTreesChecked() // 更新树结构
    },
    clearDevices() {
      // 清空选中的用户
      this.devices = []
      this.updateTreesChecked() // 更新树结构
    },
    updateTreesChecked() {
      // 更新树结构
      let keys = []

      this.devices.forEach(item => {
        keys.push(item.id)
      })

      this.$refs.tree.setCheckedKeys(keys)
    },
    checkChange() {
      // 选中设备
      let selectNodes = this.$refs.tree.getCheckedNodes()

      let devices = []

      if (selectNodes && selectNodes.length) {
        selectNodes.forEach(item => {
          if (item.type == 'device') {
            devices.push({ id: item.id, name: item.label })
          }
        })
      }

      this.devices = devices
    },
    deviceDetail(deviceItem) {
      // 设备详情
      this.$EventBus.$emit('view-component-change', {
        component: 'DeviceDetail', options: {
          deviceId: deviceItem.id, deviceName: '设备详情',
          center: deviceItem.center
        }
      })
    },
    goLocation(data) {
      // 网格设备定位
      if (!data.online) {
        this.$message.error('当前设备为离线状态')
        return
      }
      if (data.type == 'device') {
        this.$EventBus.$emit('screen-device-location', { id: data.id }) // 通知网格定位
      } else {
        this.$EventBus.$emit('screen-org-location', { id: data.id }) // 通知组织定位
      }
    },
    formatDeviceOrgTrees(child) {
      // 处理数据
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = { id: item.orgId, label: item.orgName, type: 'org' }

          let nodeChildren = this.formatDeviceOrgTrees(item.orgResps)

          if (item.devices && item.devices.length) {
            item.devices.forEach(device => {
              nodeChildren.push({ id: device.deviceId, label: device.deviceName, type: 'device', online: device.online, disabled: !device.online, deviceType: 1 })
            })
          }
          trees.push(nodeChildren && nodeChildren.length ? { ...node, children: nodeChildren } : node)
        })
      }
      return trees
    },
    devicevideoPlay() {
    // 多屏设备播放
      if (this.devices && this.devices.length > 0) {
        let devices = this.devices.map(item => (
          {
            deviceId: item.id,
            name: item.name
          }
        ))

        this.$EventBus.$emit('device-video-play', devices)
      } else {
        this.$message.error('请选择设备')
      }
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('map-device-online-change', this.onlineDevicesChange)
  }
}
</script>
