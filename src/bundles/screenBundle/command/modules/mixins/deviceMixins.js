import { getMarkerCluster } from '@/map/aMap/aMapUtil'
import { JcDeviceIcons } from '@/config/JcIconConfig'

import { getScreenDeviceData } from '@/api/screen'
import { getUser } from '@/libs/storage'
let deviceData = { markerCluster: null, devices: {}, lnglats: [] }

let MarkerCluster //存储 MarkerCluster

export default {
  data() {
    return {
      hkDeviceIds: [],
      deviceOrgId: ''
    }
  },
  created() {
    // 利用用户来模拟事件
    // this.$EventBus.$on('map-device-change', this.deviceMap)
    //type 1 设备初始化在线， devices [{deviceId，type，name，lng, lat}] 在线
    //type 2 新增设备在线， devices {deviceId，type，name，lng, lat} 在线
    //type 3 设备离线 deviceIds
    //设备变更，处理完之后，知道在线的设备id，取出id数组


    //  推送设备(网巡车,无人机)初始化
    this.$EventBus.$on('map-device-change', this.initDeviceMap)
    this.$EventBus.$on('org-change', this.deviceOrgChange) //监听第一次组织级别切换
    this.$EventBus.$on('show-word-change', this.deviceShowWordChange) //监听文字显示切换
  },
  methods: {
    deviceOrgChange(org) {
      this.deviceOrgId = org.orgId
    },
    async initDeviceData() {
      // 发送请求获取数据
      let screenDeviceData = await getScreenDeviceData({ orgId: this.deviceOrgId, projectId: this.project.projectId })

      let hkDeviceIds = [], devices = []

      if (screenDeviceData && screenDeviceData.length) {
        //去处理离线和在线
        for (let i = 0; i < screenDeviceData.length; i++) {
          let deviceItem = screenDeviceData[i]

          if (deviceItem.position) {
            hkDeviceIds.push(deviceItem.deviceId)
            let position = deviceItem.position.split(',') // 切割坐标

            devices.push({ deviceId: deviceItem.deviceId, type: deviceItem.type, name: deviceItem.name, lng: position[0], lat: position[1] })
          }

          let index = this.hkDeviceIds.findIndex(deviceId => deviceId == deviceItem.deviceId)

          if (index > -1) {
            this.hkDeviceIds.splice(index, 1)
          }
        }
      }

      this.formatClearDevices(this.hkDeviceIds)
      this.deviceMap(devices)
      this.hkDeviceIds = hkDeviceIds
    },
    formatClearDevices(deviceIds) {
      //清除离线设备
      deviceIds.forEach(deviceId => {
        // 清理devices
        for (let key in deviceData.devices) {
          if (deviceData.devices[key].deviceId == deviceId) {
            delete deviceData.devices[key]
            break
          }
        }

        // 清理lnglats
        for (let i = 0; i < deviceData.lnglats.length; i++) {
          if (deviceData.lnglats[i].deviceId == deviceId) {
            deviceData.lnglats.splice(i, 1)
            break
          }
        }
      })
    },
    async initDeviceMap(data) {
      if (data.type == 3) {
        // 如果类型为3, 删除离线设备
        this.formatClearDevices(data.deviceIds)
      } else if (data.type == 1) {
        // 如果推荐设备类型为1 清空之前数据, 初始化
        this.clearDevices() // 清除之前的记录

        // 初始化后重新执行固定设备
        this.initDeviceData()
      }

      this.deviceMap(data.devices) // 将推送设备列表传递deviceMap处理
    },
    async deviceMap(data) {
      // 处理地图数据
      MarkerCluster = await getMarkerCluster()

      // 处理用户信息
      if (data && data.length) {
        data.forEach(item => {
          // 计算事件的中心点坐标和key, 处理坐标相同的情况
          let { center, key } = this.getDeviceCenterAndKey(item.lng, item.lat, item.deviceId)

          console.log('deviceCenterAndKey', center, key)
          console.log('deviceCenterAndKey', deviceData)

          let lnglat = deviceData.lnglats.find(device => device.deviceId == item.deviceId)

          console.log('device', lnglat)

          if (lnglat) {
            delete deviceData.devices[lnglat.key]
            // lnglat.lnglat = center
          } else {
            deviceData.lnglats.push({ lnglat: center, key, deviceId: item.deviceId })
          }
          console.log('deviceData', deviceData)
          deviceData.devices[key] = { ...item, center }
        })
      }

      if (deviceData.markerCluster) {
        //如果已经存在，则去调整数据显示
        deviceData.markerCluster.setData(deviceData.lnglats)
      } else {
        deviceData.markerCluster = new MarkerCluster(null, deviceData.lnglats, {
          userSize: 60,
          // renderClusterMarker: this.renderDeviceClusterMarker,  // 设备不需要聚合
          renderMarker: this.renderDeviceMarker
        })
        deviceData.markerCluster.on('click', this.markerDeviceClusterClick)
      }
      this.fitDevices() //控制用户显示
    },

    // renderDeviceClusterMarker(context) {
    //   console.log('绘制用户-聚合绘制', context)
    //   context.marker.setAnchor('center')
    //   context.marker.setzIndex(20)
    //   context.marker.setContent(`<div class="jc-cluster-content" style="background-image: url(${JcUserIcons.cluster});">${context.count}</div>`)
    // },
    renderDeviceMarker(context) {
      console.log('绘制用户-单点绘制', context)
      let key = this.getKeyByLngLat(context.data[0].lnglat.lng, context.data[0].lnglat.lat)

      let deviceItem = deviceData.devices[key]

      //过滤掉用户信息为空的场景
      if (!deviceItem) {
        return
      }

      let content = '<div class="jc-marker-content jc-market-center">'

      if (this.deviceTipVisible) {
        content += `<div class="jc-marker-title">${deviceItem.resourceTypeName}</div>`
      }
      //处理用户图标显示
      if (deviceItem.resourceType == 1) {
        content += `<img src=${JcDeviceIcons.camera} class="jc-marker-icon"/></div>`
      } else if (deviceItem.resourceType == 2) {
        content += `<img src=${JcDeviceIcons.uav} class="jc-marker-icon"/></div>`
      } else {
        content += `<img src=${JcDeviceIcons.netpatrolcar} class="jc-marker-icon"/></div>`
      }


      context.marker.setPosition(deviceItem.center)
      context.marker.setContent(content)
    },

    //  点击弹窗
    markerDeviceClusterClick(context) {
      console.log('绘制用户-点击', context)
      let myJcMap = this.getMyJcMap() //获取地图对象

      //处理数据，如果是单个则去通知显示详情，是多个的聚合，则定位到显示
      if (context.clusterData.length > 1) {
        myJcMap.map.setBounds(this.getAmapBundles(context.clusterData))
      } else {
        //获取信息去通知显示详情
        let key = this.getKeyByLngLat(context.lnglat.lng, context.lnglat.lat)

        let deviceItem = deviceData.devices[key]

        this.$EventBus.$emit('view-component-change', {
          component: 'DeviceDetail', options: {
            deviceId: deviceItem.deviceId, deviceName: '设备详情',
            center: deviceItem.center
          }
        }) //通知窗口改变
      }
    },
    getDeviceCenterAndKey(lng, lat, deviceId) {
      let center = [parseFloat(lng).toFixed(6), parseFloat(lat).toFixed(6)]

      let key = center.join(',')


      //处理是已经有事件和当前事件位置完全相同，如果相同则进行处理偏差处理
      let device = deviceData.devices[key]

      console.log('device', device)
      if (device && device.deviceId != deviceId) {
        //如果该坐标用户存在，且不是当前用户，则将该用户位置进行偏差，再次进行处理
        return this.getDeviceCenterAndKey(parseFloat(lng) + 0.000001, parseFloat(lat) + 0.000001, deviceId)
      }

      return { center, key }
    },
    fitDevices() {
      if (!deviceData.markerCluster) {
        return
      }
      let myJcMap = this.getMyJcMap() //获取地图对象


      //处理用户是否显示
      if (this.deviceTipVisible) {
        deviceData.markerCluster.setMap(myJcMap.map)

        //处理是否显示标题，以及状态
        deviceData.markerCluster.setGridSize(120)
      } else {
        deviceData.markerCluster.setMap(null)
      }
    },
    clearDevices() {
      //清除所有数据
      if (deviceData && deviceData.markerCluster) {
        deviceData.markerCluster.setMap(null)
      }
      this.gatherUserIds = [] //重置用户聚合id数组
      this.abnormalUserIds = [] //重置用户异常id数组

      deviceData = { markerCluster: null, devices: {}, lnglats: [] }
    },
    deviceShowWordChange(words) {
      this.deviceTipVisible = words.includes('device') //如果存在用户显示，则显示用户，否则不显示
      this.fitDevices()
    }
  },
  beforeDestroy() {
    this.clearDevices()
    this.$EventBus.$off('map-device-change', this.initDeviceMap)
    this.$EventBus.$off('org-change', this.deviceOrgChange)
    this.$EventBus.$off('show-word-change', this.deviceShowWordChange)
  }
}
