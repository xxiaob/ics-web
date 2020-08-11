import { getMarkerCluster } from '@/map/aMap/aMapUtil'
import { JcUserIcons } from '@/config/JcIconConfig'

let deviceData = { markerCluster: null, users: {}, lnglats: [] }

let MarkerCluster //存储 MarkerCluster

export default {
  data() {
    return {}
  },
  created() {
    // 利用用户来模拟事件
    this.$EventBus.$on('map-user-change', this.deviceMap)

    this.$EventBus.$on('show-word-change', this.deviceShowWordChange) //监听文字显示切换
  },
  methods: {
    async deviceMap(data) {
      console.log('--------------------------')
      console.log('deviceMap', data)

      MarkerCluster = await getMarkerCluster()

      if (data.type == 1) {
        // 如果是重新开始,则清除之前的用户显示
        this.clearDevices()
      }

      // 处理用户信息
      if (data.users && data.users.length) {
        data.users.forEach(item => {
          // 计算事件的中心点坐标和key, 处理坐标相同的情况
          let { center, key } = this.getDeviceCenterAndKey(item.lng, item.lat, item.userId)

          console.log('deviceCenterAndKey', center, key)

          let lnglat = deviceData.lnglats.find(user => user.userId == item.userId)

          if (lnglat) {
            delete deviceData.users[lnglat.key]
            lnglat.lnglat = center
          } else {
            deviceData.lnglats.push({ lnglat: center, key, userId: item.userId })
          }
          console.log('deviceData', deviceData)
          deviceData.users[key] = { ...item, center }
        })
      }

      if (deviceData.markerCluster) {
        //如果已经存在，则去调整数据显示
        deviceData.markerCluster.setData(deviceData.lnglats)
      } else {
        deviceData.markerCluster = new MarkerCluster(null, deviceData.lnglats, {
          userSize: 60,
          renderClusterMarker: this.renderDeviceClusterMarker,
          renderMarker: this.renderDeviceMarker
        })
        deviceData.markerCluster.on('click', this.markerDeviceClusterClick)
      }
      this.fitDevices() //控制用户显示
    },
    renderDeviceClusterMarker(context) {
      console.log('绘制用户-聚合绘制', context)
      context.marker.setAnchor('center')
      context.marker.setzIndex(20)
      context.marker.setContent(`<div class="jc-cluster-content" style="background-image: url(${JcUserIcons.cluster});">${context.count}</div>`)
    },
    renderDeviceMarker(context) {
      console.log('绘制用户-单点绘制', context)
      let key = this.getKeyByLngLat(context.data[0].lnglat.lng, context.data[0].lnglat.lat)

      let userItem = deviceData.users[key]

      //过滤掉用户信息为空的场景
      if (!userItem) {
        return
      }

      let content = '<div class="jc-marker-content jc-market-center">'

      if (this.deviceTipVisible) {
        content += `<div class="jc-marker-title">${userItem.userName}</div>`
      }
      //处理用户图标显示
      if (this.abnormalUserIds.includes(userItem.userId)) {
        content += `<img src=${JcUserIcons.abnormal} class="jc-marker-icon"/></div>`
      } else if (this.gatherUserIds.includes(userItem.userId)) {
        content += `<img src=${JcUserIcons.gather} class="jc-marker-icon"/></div>`
      } else {
        content += `<img src=${JcUserIcons.online} class="jc-marker-icon"/></div>`
      }

      context.marker.setPosition(userItem.center)
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

        let userItem = deviceData.users[key]

        this.$EventBus.$emit('view-component-change', {
          component: 'UserDetail', options: {
            userId: userItem.userId, userName: userItem.userName,
            center: userItem.center
          }
        }) //通知窗口改变
      }
    },
    getDeviceCenterAndKey(lng, lat, userId) {
      let center = [parseFloat(lng).toFixed(6), parseFloat(lat).toFixed(6)]

      let key = center.join(',')

      //处理是已经有事件和当前事件位置完全相同，如果相同则进行处理偏差处理
      let user = deviceData.users[key]

      if (user && user.userId != userId) {
        //如果该坐标用户存在，且不是当前用户，则将该用户位置进行偏差，再次进行处理
        return this.getDeviceCenterAndKey(parseFloat(lng) + 0.000001, parseFloat(lat) + 0.000001, userId)
      }

      return { center, key }
    },
    fitDevices() {
      if (!deviceData.markerCluster) {
        return
      }
      let myJcMap = this.getMyJcMap() //获取地图对象

      console.log('fitDevices', this.deviceTipVisible)

      //处理用户是否显示
      if (this.deviceTipVisible) {
        deviceData.markerCluster.setMap(myJcMap.map)

        //处理是否进行聚合
        if (this.togetherVisible) {
          deviceData.markerCluster.setMaxZoom(18)
        } else {
          deviceData.markerCluster.setMaxZoom(0)
        }
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

      deviceData = { markerCluster: null, users: {}, lnglats: [] }
    },
    deviceShowWordChange(words) {
      this.deviceTipVisible = words.includes('device') //如果存在用户显示，则显示用户，否则不显示
      console.log('deviceTipVisible', this.deviceTipVisible)
      this.fitDevices()
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('map-user-change', this.deviceMap)
    this.$EventBus.$off('show-word-change', this.deviceShowWordChange)
  }
}
