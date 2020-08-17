<template>
  <view-warp title="组织设备">
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-view-content" v-loading="loading">
      <el-tree ref="tree" :default-expanded-keys="expandedKeys" :data="trees" :props="props" :show-checkbox="true" node-key="id" :filter-node-method="filterNode" @check="checkChange">
        <div class="custom-tree-node" slot-scope="{ node,data}">
          <div class="jc-tree-label no-select jc-flex-warp"  :class="{'jc-devices-offline': data.type=='device' && !data.online, 'jc-device':data.type=='device'}" >
            <i  class="iconfont" :class="{'iconshexiangtou':data.deviceType==DEVICE_TYPES.CAMERA,'iconwurenji':data.deviceType==DEVICE_TYPES.UAV,'iconmap_policecar':data.deviceType==DEVICE_TYPES,'online':data.online}" v-if="data.type=='device'"></i>
            <div class="jc-text-warp.NETPATROLCAR" v-text="node.label"></div>
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
    this.$EventBus.$on('map-device-online-change', this.onlineDevicesChange) //监听在线设备变化
  },
  methods: {
    onlineDevicesChange(onlineDevices) {
      this.onlineDevices = onlineDevices
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
      let selectNodes = this.$refs.tree.getCheckedNodes()

      console.log('selectNodes', selectNodes)
      let devices = []

      if (selectNodes && selectNodes.length) {
        selectNodes.forEach(item => {
          if (item.type == 'device') {
            devices.push({ id: item.id, name: item.label })
          }
        })
      }
      console.log('devices', devices)

      this.devices = devices
    },
    deviceDetail(deviceItem) {
      console.log('deviceItem', deviceItem)
      // 详情
      this.$EventBus.$emit('view-component-change', {
        component: 'DeviceDetail', options: {
          deviceId: deviceItem.id, deviceName: '设备详情',
          center: deviceItem.center
        }
      })
    },

    goLocation(data) {
      // 定位
      console.log('screen-org-location-data', data)
      if (data.type == 'device') {
        console.log('device', data)
        this.$EventBus.$emit('screen-device-location', { id: data.id }) // 通知网格定位
      } else {
        this.$EventBus.$emit('screen-org-location', { id: data.id }) // 通知组织定位
      }
    },

    // 处理数据
    formatDeviceOrgTrees(child) {
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
    }
  },
  // 多屏设备播放
  devicevideoPlay() {
    console.log('device', this.devices)
    let devices = this.devices.map(item => item.deviceId)

    this.$EventBus.$emit('device-video-play', devices)
  },
  beforeDestroy() {
    this.$EventBus.$off('map-device-online-change', this.onlineDevicesChange)
  }
}
</script>
