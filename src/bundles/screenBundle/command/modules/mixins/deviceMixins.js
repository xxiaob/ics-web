import { JcDeviceIcons } from '@/config/JcIconConfig'
import { getScreenDeviceData } from '@/api/screen'
import { DEVICE_TYPES } from '@/constant/Dictionaries'
import { MAP_EVENT, MAP_SIGN_ZINDEX } from '@/constant/CONST'
import { JcMapMarker } from '@/map'

let deviceData = { } //存储所有的设备数据

let initGetFixedDeviceId = false // 初始获取一次固定设备

export default {
  data() {
    return {
      hkDeviceIds: [], // 所有在线设备ids
      fixedDeviceIds: [], // 固定在线设备ids
      pushDeviceIds: [], // 所有推送在线设备ids
      deviceOrgId: '',
      deviceSignVisible: false, //是否显示设备
      deviceTipVisible: false //设备是否显示标题
    }
  },
  created() {
    // 利用设备来模拟事件
    // this.$EventBus.$on('map-device-change', this.deviceMap)
    //type 1 设备初始化在线， devices [{deviceId，type，name，lng, lat}] 在线
    //type 2 新增设备在线， devices {deviceId，type，name，lng, lat} 在线
    //type 3 设备离线 deviceIds
    //设备变更，处理完之后，知道在线的设备id，取出id数组

    //  推送设备(网巡车,无人机)初始化
    this.$EventBus.$on('map-device-change', this.initDeviceMap)
    this.$EventBus.$on('screen-device-location', this.deviceLocation) //监听设备定位
    this.$EventBus.$on('show-sign-change', this.deviceShowSignChange) //过滤信息显示
    this.$EventBus.$on('org-change', this.deviceOrgChange) //监听第一次组织级别切换
  },
  methods: {
    deviceOrgChange(org) {
      this.deviceOrgId = org.orgId //获取ordID
    },
    async initDeviceData() {
      //  当初始大屏不显示设备, 但是接口中有在线摄像头时请求一次,将在线摄像头id存储
      if (!this.deviceSignVisible && initGetFixedDeviceId) {
        return
      }
      initGetFixedDeviceId = true // 初始获取完毕以后, 未来是否轮询根据大屏是否显示设备出来决定
      try {
        let screenDeviceData = await getScreenDeviceData({ orgId: this.deviceOrgId, projectId: this.project.projectId })

        let devices = [], fixedDeviceIds = []

        if (screenDeviceData && screenDeviceData.length) {
          //去处理离线和在线
          for (let i = 0; i < screenDeviceData.length; i++) {
            let deviceItem = screenDeviceData[i] // 取出数据

            // 处理经纬度
            if (deviceItem.position) {
              fixedDeviceIds.push(deviceItem.deviceId) // 获取所有在线固定设备id
              let position = deviceItem.position.split(',') // 切割坐标

              devices.push({ deviceId: deviceItem.deviceId, type: deviceItem.resourceType, name: deviceItem.deviceName, lng: position[0], lat: position[1] })
            }
          }
        }
        this.fixedDeviceIds = fixedDeviceIds // 保存当前所有在线摄像头的设备Id
        this.deviceMap(devices) // 处理数据
      } catch (error) {
        console.log(error)
      }
    },
    async initDeviceMap(data) {
      // 处理推送设备数据
      if (data.type == 3) {
        // 清理离线设备的id
        data.deviceIds.forEach(ddeviceId => {
          let index = this.pushDeviceIds.findIndex(deviceId => deviceId == ddeviceId)

          if (index > -1) {
            this.pushDeviceIds.splice(index, 1)
          }
        })
      } else if (data.type == 1) {
        // 如果推荐设备类型为1 清空之前数据, 初始化
        this.clearDevices() // 清除之前的记录
        this.initDeviceData() //初始化后重新执行固定设备
        this.deviceTimer = setInterval(this.initDeviceData, 5 * 60 * 1000) // 固定摄像头轮询
      }

      // 获取所有在线推送设备id集合
      if (data.devices && data.devices.length) {
        data.devices.forEach(device => {
          if (!this.pushDeviceIds.includes(device.deviceId)) {
            this.pushDeviceIds.push(device.deviceId)
          }
        })
      }
      this.deviceMap(data.devices) //将推送设备列表传递deviceMap处理
    },
    async deviceMap(data) {
      // 所有在线设备推送给设备列表展示
      this.hkDeviceIds = [...this.pushDeviceIds, ...this.fixedDeviceIds]
      this.$EventBus.$emit('map-device-online-change', this.hkDeviceIds)

      // 处理设备信息
      if (data && data.length) {
        data.forEach(item => {
          if (deviceData[item.deviceId]) {
            Object.assign(deviceData[item.deviceId], item, { center: [item.lng, item.lat] })
          } else {
            deviceData[item.deviceId] = { ...item, center: [item.lng, item.lat] }
          }
        })
      }
      this.fitDevices() //控制设备显示
    },
    getDeviceIcon(device) {
      if (device.type == DEVICE_TYPES.CAMERA) {
        return JcDeviceIcons.camera
      }
      if (device.type == DEVICE_TYPES.UAV) {
        return JcDeviceIcons.uav
      }
      return JcDeviceIcons.netpatrolcar
    },
    deviceLocation(data) {
      //监听设备位置
      if (this.deviceSignVisible) {
        // 查看设备是否是否存在,存在更行,不存在则添加
        if (deviceData[data.id]) {
          if (deviceData[data.id].labelMarker) {
            deviceData[data.id].labelMarker.marker.setTop(true)
          }
          let myJcMap = this.getMyJcMap() //获取地图对象

          myJcMap.map.setZoomAndCenter(20, deviceData[data.id].center)
        }
      } else {
        // 设备未在指挥大屏显示
        this.$message.error('当前设备未在大屏显示')
      }
    },
    fitDevices() {
      let myJcMap = this.getMyJcMap() //获取地图对象

      for (let deviceId in deviceData) {
        let signItem = deviceData[deviceId]

        //先处理是否在在线列表，如果不在，则进行清理
        if (!this.hkDeviceIds.includes(deviceId)) {
          if (signItem.labelMarker) {
            signItem.labelMarker.hide()
          }
          delete deviceData[deviceId]
          continue
        }

        if (this.deviceSignVisible) {
          let signIcon = this.getDeviceIcon(signItem)

          if (signItem.labelMarker) {
            signItem.labelMarker.icon = signIcon
            signItem.labelMarker.titleVisible = this.deviceTipVisible
            signItem.labelMarker.show(signItem.center)
          } else {
            signItem.labelMarker = new JcMapMarker({
              id: signItem.deviceId,
              icon: signIcon,
              map: myJcMap,
              zIndex: MAP_SIGN_ZINDEX.DEVICE,
              name: signItem.name,
              position: signItem.center,
              titleVisible: this.deviceTipVisible
            })
            signItem.labelMarker.on(MAP_EVENT.CLICK, ()=> {
              this.$EventBus.$emit('view-component-change', { component: 'DeviceDetail', options: {
                deviceId: signItem.deviceId, deviceName: signItem.name, center: signItem.center
              } }) //通知窗口改变
            })
          }
        } else if (signItem.labelMarker) {
          signItem.labelMarker.hide()
        }
      }
    },
    clearDevices() {
      //清除所有数据
      for (let deviceId in deviceData) {
        let signItem = deviceData[deviceId]

        if (signItem.labelMarker) {
          signItem.labelMarker.hide()
        }
      }
      if (this.deviceTimer) {
        clearInterval(this.deviceTimer) // 清理固定摄像头轮询
      }

      this.hkDeviceIds = []
      this.pushDeviceIds = []
      this.fixedDeviceIds = []
      deviceData = { }
    },
    deviceShowWordChange(words) {
      let deviceTipVisible = words.includes('device')

      if (this.deviceTipVisible == deviceTipVisible) {
        return
      }
      this.deviceTipVisible = deviceTipVisible
      this.fitDevices()
    },
    deviceShowSignChange(data) {
      let needFit = false

      //处理标题是否显示
      let deviceTipVisible = data.words.includes('device')

      if (this.deviceTipVisible != deviceTipVisible) {
        this.deviceTipVisible = deviceTipVisible
        needFit = true
      }

      //处理是否显示实体
      let deviceSignVisible = data.signs.includes('device')

      if (this.deviceSignVisible != deviceSignVisible) {
        this.deviceSignVisible = deviceSignVisible
        if (this.deviceSignVisible) {
          this.initDeviceData() //初始化后重新执行固定设备
          return
        }
        needFit = true
      }

      if (needFit) {
        this.fitDevices()
      }
    }
  },
  beforeDestroy() {
    this.clearDevices()
    this.$EventBus.$off('map-device-change', this.initDeviceMap)
    this.$EventBus.$off('show-sign-change', this.deviceShowSignChange)
    this.$EventBus.$off('org-change', this.deviceOrgChange)
    this.$EventBus.$off('screen-device-location', this.deviceLocation)
  }
}
