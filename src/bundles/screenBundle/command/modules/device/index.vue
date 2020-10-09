<template>
  <view-warp title="组织设备">
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-view-content" v-loading="loading">
      <el-tree ref="tree" :default-expanded-keys="expandedKeys" :data="trees" :props="props" :show-checkbox="true" node-key="id" :filter-node-method="filterNode" @check="checkChange">
        <div class="custom-tree-node" slot-scope="{ node,data}">
          <div class="jc-tree-label no-select jc-flex-warp" :class="{'jc-devices-offline': data.type=='device' && !data.online, 'jc-device':data.type=='device'}">
            <i class="iconfont" :class="{'iconshexiangtou':data.deviceType==DEVICE_TYPES.CAMERA,'iconwurenji':data.deviceType==DEVICE_TYPES.UAV,'iconmap_policecar':data.deviceType==DEVICE_TYPES.NETPATROLCAR,'online':data.online}" v-if="data.type=='device'"></i>
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
        <div class="jc-opera-item" @click="goMeeting('audio')">音频会议</div>
        <div class="jc-opera-item" @click="goMeeting('video')">视频会议</div>
        <div class="jc-opera-item" @click="devicevideoPlay">多方观摩</div>
        <div class="jc-opera-item" @click="clearDevices">清除</div>
      </div>
    </div>
  </view-warp>
</template>
<script>
import { getDeviceList } from '@/api/device'
import TreesFilterMixins from '@/mixins/TreesFilterMixins'
import { DEVICE_TYPES, VIDEO_INVITE_TYPES } from '@/constant/Dictionaries'

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
      usersToDevices: [], // 在线设备类型为网巡车集合
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
      // 获取所有在线设备的id
      this.onlineDevices = onlineDevices
      this.onlineChange(this.trees) // 调用方法从新处理数据
    },
    onlineChange(trees) {
      // 处理离线/在线切换的方法
      trees.index = -1

      for (let i = 0; i < trees.length; i++) {
        let treesItem = trees[i]

        if (treesItem.type == 'org') {
          trees.index = i
          this.onlineChange(treesItem.children || []) // 递归调用处理在线离线设备方法
        } else {
          let isOnline = this.onlineDevices.includes(treesItem.id) // 判断是否在线

          treesItem.online = isOnline
          treesItem.disabled = !isOnline


          // 如果设备在线,并且不是在设备第一位,则改变位置,如果设备已经是第一位,只改变状态
          if (isOnline && (trees.index + 1 != i) && (trees.index != i)) {
            this.$refs.tree.remove(treesItem)

            // 如果trees.index标识为-1 标识当前组织下只有设备没有下级组织, 因此在第一个设备前插入在线设备
            if (trees.index !== -1 ) {
              this.$refs.tree.insertAfter(treesItem, trees[trees.index])
            } else {
              this.$refs.tree.insertBefore(treesItem, trees[0])
            }
          }
        }
      }
    },
    async initData() {
      // 初始数据
      this.loading = true
      try {
        const orgsAndDevice = await getDeviceList({ projectId: this.project.projectId })

        this.trees = this.formatDeviceOrgTrees(orgsAndDevice) // 处理组织和用户

        this.expandedKeys = this.trees.length ? [this.trees[0].id] : [] // 设置第一级默认展开

        this.initOptionsDevice() // 初始设备
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    initOptionsDevice() {
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
      this.devices.splice(index, 1) // 删除设备
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

      console.log('选中设备', selectNodes)

      let devices = [], usersToDevices = []

      if (selectNodes && selectNodes.length) {
        selectNodes.forEach(item => {
          if (item.type == 'device') {
            devices.push({ id: item.id, name: item.label })

            if (item.deviceType === DEVICE_TYPES.NETPATROLCAR) {
              // 选中的在线设备, 并且为网巡车, 记录
              usersToDevices.push({ id: item.userId, name: item.label })
            }
          }
        })
      }

      this.devices = devices
      this.usersToDevices = usersToDevices
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
      if (data.type == 'device') {
        // 网格设备定位
        if (!data.online) {
          this.$message.error('当前设备为离线状态')
          return
        }
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
              nodeChildren.push({ id: device.deviceId, label: device.deviceName, type: 'device', online: device.online, disabled: !device.online, deviceType: device.deviceType, userId: device.userId })
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
    },
    goMeeting(talkType) {
      //去进行会议

      console.log('设备列表, this.usersToDevices', this.usersToDevices)

      // 未选中设备,提示请选择设备
      if (!(this.devices && this.devices.length > 0)) {
        this.$message.error('请选择设备')
        return
      }

      // 如果选择设备, 就判断是不是有网巡车
      if (this.usersToDevices.length) {
        if (this.usersToDevices.length > 17) {
          this.$message.error('最多支持17台设备')
        } else {
          this.$EventBus.$emit('screen-opera-control', { type: 'select', isSelect: false })
          this.$EventBus.$emit('screen-media-live', { users: this.usersToDevices, type: talkType == 'video' ? VIDEO_INVITE_TYPES.MEETVIDEO : VIDEO_INVITE_TYPES.MEETAUDIO })
          this.clearDevices() //清空用户
        }
      } else {
        this.$message.error('未选择网巡车设备')
      }
    }

  },
  beforeDestroy() {
    this.$EventBus.$off('map-device-online-change', this.onlineDevicesChange) //解绑监听在线
  }
}
</script>
