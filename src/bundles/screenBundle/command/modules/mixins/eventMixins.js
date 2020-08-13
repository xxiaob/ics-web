import { getMarkerCluster } from '@/map/aMap/aMapUtil'
import { JcUserIcons } from '@/config/JcIconConfig'
import { getScreenEventData } from '@/api/screen'
import { getUser } from '@/libs/storage'
import moment from 'moment'

let eventData = { markerCluster: null, users: {}, lnglats: [] }

let MarkerCluster //存储 MarkerCluster

import { MESSAGE_TYPE } from '@/constant/Dictionaries'

export default {
  data() {
    return {
      today: new Date(moment().format('YYYY-MM-DD') + ' 00:00:00').getTime(), // 初始时间
      ScreenEventData: {}
    }
  },
  created() {
    // 利用用户来模拟事件
    this.$EventBus.$on('map-user-change', this.initEventData)
    this.initEventData()

    this.$EventBus.$on('show-word-change', this.eventShowWordChange) //监听文字显示切换
    this.$EventBus.$on('show-together-change', this.eventTogetherChange) // 监听是否聚合
  },
  methods: {
    async initEventData(data) {
      let beginTime = new Date(this.today) // 开始时间

      let endTime = new Date(this.today + 24 * 60 * 60 * 1000) // 结束时间


      let { orgId } = await getUser() // 获取用户orgId

      let { projectId } = this.project // 获取projectId

      console.log(beginTime, endTime, orgId, projectId)


      // 发送请求获取数据
      let ScreenEventData = await getScreenEventData({ orgId, projectId })

      console.log('ScreenEventData', ScreenEventData)


      MarkerCluster = await getMarkerCluster()

      if (data.type == 1) {
        // 如果是重新开始,则清除之前的用户显示
        this.clearEvents()
      }

      // 处理用户信息
      if (data.users && data.users.length) {
        data.users.forEach(item => {
          // 计算事件的中心点坐标和key, 处理坐标相同的情况
          let { center, key } = this.getEventCenterAndKey(item.lng, item.lat, item.userId)

          console.log('eventCenterAndKey', center, key)

          let lnglat = eventData.lnglats.find(user => user.userId == item.userId)

          if (lnglat) {
            delete eventData.users[lnglat.key]
            lnglat.lnglat = center
          } else {
            eventData.lnglats.push({ lnglat: center, key, userId: item.userId })
          }
          console.log('eventData', eventData)
          eventData.users[key] = { ...item, center }
        })
      }

      if (eventData.markerCluster) {
        //如果已经存在，则去调整数据显示
        eventData.markerCluster.setData(eventData.lnglats)
      } else {
        eventData.markerCluster = new MarkerCluster(null, eventData.lnglats, {
          userSize: 60,
          renderClusterMarker: this.renderEventClusterMarker,
          renderMarker: this.renderEventMarker
        })
        eventData.markerCluster.on('click', this.markerEventClusterClick)
      }
      this.fitEvents() //控制用户显示
    },
    renderEventClusterMarker(context) {
      console.log('绘制用户-聚合绘制', context)
      context.marker.setAnchor('center')
      context.marker.setzIndex(20)
      context.marker.setContent(`<div class="jc-cluster-content" style="background-image: url(${JcUserIcons.cluster});">${context.count}</div>`)
    },
    renderEventMarker(context) {
      console.log('绘制用户-单点绘制', context)
      let key = this.getKeyByLngLat(context.data[0].lnglat.lng, context.data[0].lnglat.lat)

      let userItem = eventData.users[key]

      //过滤掉用户信息为空的场景
      if (!userItem) {
        return
      }

      let content = '<div class="jc-marker-content jc-market-center">'

      if (this.eventTipVisible) {
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
    markerEventClusterClick(context) {
      console.log('绘制用户-点击', context)
      let myJcMap = this.getMyJcMap() //获取地图对象

      //处理数据，如果是单个则去通知显示详情，是多个的聚合，则定位到显示
      if (context.clusterData.length > 1) {
        myJcMap.map.setBounds(this.getAmapBundles(context.clusterData))
      } else {
        //获取信息去通知显示详情
        // let key = this.getKeyByLngLat(context.lnglat.lng, context.lnglat.lat)

        // let userItem = eventData.users[key]


        this.$EventBus.$emit('view-component-change', {
          component: 'MessageDetail', options: {
            id: '78571410770886656',
            type: MESSAGE_TYPE.TEMPORARY
          }
        }) // 通知窗口改变
      }
    },
    getEventCenterAndKey(lng, lat, userId) {
      let center = [parseFloat(lng).toFixed(6), parseFloat(lat).toFixed(6)]

      let key = center.join(',')

      //处理是已经有事件和当前事件位置完全相同，如果相同则进行处理偏差处理
      let user = eventData.users[key]

      if (user && user.userId != userId) {
        //如果该坐标用户存在，且不是当前用户，则将该用户位置进行偏差，再次进行处理
        return this.getEventCenterAndKey(parseFloat(lng) + 0.000001, parseFloat(lat) + 0.000001, userId)
      }

      return { center, key }
    },
    fitEvents() {
      if (!eventData.markerCluster) {
        return
      }
      let myJcMap = this.getMyJcMap() //获取地图对象

      console.log('fitEvents', this.eventTipVisible)

      //处理用户是否显示
      if (this.eventTipVisible) {
        eventData.markerCluster.setMap(myJcMap.map)

        console.log('eventTogetherVisible', this.eventTogetherVisible)
        //处理是否进行聚合
        if (this.eventTogetherVisible) {
          eventData.markerCluster.setMaxZoom(18)
        } else {
          eventData.markerCluster.setMaxZoom(0)
        }
        //处理是否显示标题，以及状态
        eventData.markerCluster.setGridSize(120)
      } else {
        eventData.markerCluster.setMap(null)
      }
    },
    clearEvents() {
      //清除所有数据
      if (eventData && eventData.markerCluster) {
        eventData.markerCluster.setMap(null)
      }
      this.gatherUserIds = [] //重置用户聚合id数组
      this.abnormalUserIds = [] //重置用户异常id数组

      eventData = { markerCluster: null, users: {}, lnglats: [] }
    },
    eventShowWordChange(words) {
      this.eventTipVisible = words.includes('event') //如果存在用户显示，则显示用户，否则不显示
      console.log(this.eventTipVisible)
      this.fitEvents()
    },
    eventTogetherChange(togethers) {
      this.eventTogetherVisible = togethers.includes('event') //如果存在用户聚合，则聚合用户，否则不显示
      this.fitEvents()
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('map-user-change', this.eventMap)
    this.$EventBus.$off('show-word-change', this.eventShowWordChange)
  }
}
