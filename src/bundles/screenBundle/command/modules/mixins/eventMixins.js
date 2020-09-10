import { getMarkerCluster } from '@/map/aMap/aMapUtil'
import { JcEventIcons } from '@/config/JcIconConfig'
import { getScreenEventData } from '@/api/screen'
import moment from 'moment'

let eventData = { markerCluster: null, events: {}, lnglats: [] }

let MarkerCluster //存储 MarkerCluster

import { MESSAGE_TYPE } from '@/constant/Dictionaries'

export default {
  data() {
    return {
      today: new Date(moment().format('YYYY-MM-DD')).getTime() // 初始时间
    }
  },
  created() {
    this.$EventBus.$on('show-word-change', this.eventShowWordChange) //监听文字显示切换
    this.$EventBus.$on('org-change', this.eventOrgChange) //监听第一次组织级别切换
    this.$EventBus.$on('show-together-change', this.eventTogetherChange) // 监听是否聚合
  },
  methods: {
    eventOrgChange(org) {
      // 获取ordID
      this.eventOrgId = org.orgId
      // 初始化数据
      this.initEventData()
    },
    async initEventData() {
      let startTime = new Date(this.today) // 开始时间

      let endTime = new Date(this.today + 24 * 60 * 60 * 1000) // 结束时间

      try {
        // 发送请求获取数据
        let ScreenEventData = await getScreenEventData({ orgId: this.eventOrgId, projectId: this.project.projectId, startTime, endTime })

        MarkerCluster = await getMarkerCluster()

        this.clearEvents() // 清除之前的记录

        // 处理用户信息
        if (ScreenEventData && ScreenEventData.length) {
          ScreenEventData.forEach(item => {
            // 过滤没有坐标的事件
            if (!item.position) {
              return
            }

            let position = item.position.split(',') // 切割坐标

            item.lng = position[0] // 获取精度
            item.lat = position[1] // 获取维度

            // 计算事件的中心点坐标和key, 处理坐标相同的情况
            let { center, key } = this.getEventCenterAndKey(item.lng, item.lat, item.id)


            let lnglat = eventData.lnglats.find(event => event.eventId == item.id)

            if (lnglat) {
              delete eventData.events[lnglat.key]
            } else {
              eventData.lnglats.push({ lnglat: center, key, eventId: item.id })
            }
            eventData.events[key] = { ...item, center }
          })
        }

        if (eventData.markerCluster) {
          //如果已经存在，则去调整数据显示
          eventData.markerCluster.setData(eventData.lnglats)
        } else {
          eventData.markerCluster = new MarkerCluster(null, eventData.lnglats, {
            gridSize: 120,
            renderClusterMarker: this.renderEventClusterMarker,
            renderMarker: this.renderEventMarker
          })
          eventData.markerCluster.on('click', this.markerEventClusterClick)
        }
        this.fitEvents() //控制用户显示
      } catch (error) {
        console.log(error)
      }
    },
    renderEventClusterMarker(context) {
      console.log('绘制事件-聚合绘制', context)
      context.marker.setAnchor('center')
      context.marker.setzIndex(20)
      context.marker.setContent(`<div class="jc-cluster-content" style="background-image: url(${JcEventIcons.cluster});">${context.count}</div>`)
    },
    renderEventMarker(context) {
      console.log('绘制事件-单点绘制', context)
      let key = this.getKeyByLngLat(context.data[0].lnglat.lng, context.data[0].lnglat.lat)

      let eventItem = eventData.events[key]

      //过滤掉用户信息为空的场景
      if (!eventItem) {
        return
      }

      let content = '<div class="jc-marker-content jc-market-center">'

      // 事件标题
      if (this.eventTipVisible) {
        content += `<div class="jc-marker-title">${eventItem.eventTitle}</div>`
      }
      //处理用户图标显示
      content += `<img src=${JcEventIcons.plain} class="jc-marker-icon"/></div>`


      context.marker.setPosition(eventItem.center)
      context.marker.setContent(content)
    },
    markerEventClusterClick(context) {
      console.log('绘制用户-点击', context)
      let myJcMap = this.getMyJcMap() //获取地图对象

      //处理数据，如果是单个则去通知显示详情，是多个的聚合，则定位到显示
      if (context.clusterData.length > 1) {
        console.log('event-点击')
        myJcMap.map.setBounds(this.getAmapBundles(context.clusterData))
      } else {
        //获取事件的key
        let key = this.getKeyByLngLat(context.lnglat.lng, context.lnglat.lat)

        // 通过key获取当前事件
        let eventItem = eventData.events[key]

        this.$EventBus.$emit('view-component-change', {
          component: 'MessageDetail', options: {
            id: eventItem.id,
            type: MESSAGE_TYPE.EVENT
          }
        }) // 通知窗口改变
      }
    },
    getEventCenterAndKey(lng, lat, eventId) {
      // 处理坐标
      let center = [parseFloat(lng).toFixed(6), parseFloat(lat).toFixed(6)]

      let key = center.join(',')

      //处理是已经有事件和当前事件位置完全相同，如果相同则进行处理偏差处理

      let event = eventData.events[key]

      if (event && event.id != eventId) {
        //如果该坐标用户存在，且不是当前用户，则将该用户位置进行偏差，再次进行处理
        return this.getEventCenterAndKey(parseFloat(lng) + 0.000001, parseFloat(lat) + 0.000001, eventId)
      }

      return { center, key }
    },
    fitEvents() {
      if (!eventData.markerCluster) {
        return
      }
      let myJcMap = this.getMyJcMap() //获取地图对象

      //处理事件是否显示
      if (this.eventTipVisible) {
        eventData.markerCluster.setMap(myJcMap.map)


        //处理事件是否进行聚合
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

      eventData = { markerCluster: null, events: {}, lnglats: [] }
    },
    eventShowWordChange(words) {
      this.eventTipVisible = words.includes('event') //如果存在，则显示事件，否则不显示
      this.fitEvents()
    },
    eventTogetherChange(togethers) {
      this.eventTogetherVisible = togethers.includes('event') //如果事件聚合，则聚合事件，否则不显示
      this.fitEvents()
    }
  },
  beforeDestroy() {
    this.clearEvents()
    this.$EventBus.$off('show-word-change', this.eventShowWordChange)
    this.$EventBus.$off('show-together-change', this.eventTogetherChange)
  }
}
