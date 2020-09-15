import { getMarkerCluster } from '@/map/aMap/aMapUtil'
import { JcEventIcons } from '@/config/JcIconConfig'
import { getScreenEventData } from '@/api/screen'
import { JcMapMarker } from '@/map'
import { MAP_EVENT, MAP_SIGN_ZINDEX } from '@/constant/CONST'
import moment from 'moment'

let eventData = { markerCluster: null, events: {}, lnglats: [] }

let MarkerCluster //存储 MarkerCluster

import { MESSAGE_TYPE } from '@/constant/Dictionaries'

export default {
  data() {
    return {
      eventOrgId: '',
      eventSignVisible: false, //事件是否显示
      eventTipVisible: true, //事件名称是否显示
      eventTogetherVisible: true, //事件是否聚合
      eventToday: new Date(moment().format('YYYY-MM-DD')).getTime() // 初始时间
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.eventOrgChange) //监听组织级别切换
    this.$EventBus.$on('show-sign-change', this.eventShowSignChange) //显示实体
    this.$EventBus.$on('show-word-change', this.eventShowWordChange) //监听文字显示切换
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
      this.clearEvents() // 清除之前的记录

      //如果没有显示内容，则不进行请求
      if (!this.eventSignVisible) {
        return
      }
      let startTime = new Date(this.eventToday) // 开始时间

      let endTime = new Date(this.eventToday + 24 * 60 * 60 * 1000) // 结束时间

      try {
        // 发送请求获取数据
        let ScreenEventData = await getScreenEventData({ orgId: this.eventOrgId, projectId: this.project.projectId, startTime, endTime })

        MarkerCluster = await getMarkerCluster()

        // 处理事件信息
        if (ScreenEventData && ScreenEventData.length) {
          ScreenEventData.forEach(item => {
            // 过滤没有坐标的事件
            if (!item.position) {
              return
            }

            let position = item.position.split(',') // 切割坐标

            if (position.length < 2) {
              return
            }

            item.lng = position[0] // 获取精度
            item.lat = position[1] // 获取维度

            // 计算事件的中心点坐标和key, 处理坐标相同的情况
            let { center, key } = this.getEventCenterAndKey(item.lng, item.lat, item.id)

            let lnglat = eventData.lnglats.find(event => event.eventId == item.id)

            if (lnglat) {
              if (eventData.events[lnglat.key] && eventData.events[lnglat.key].labelMarker) {
                eventData.events[lnglat.key].labelMarker.hide()
              }
              delete eventData.events[lnglat.key]
            } else {
              eventData.lnglats.push({ lnglat: center, key, eventId: item.id })
            }
            eventData.events[key] = { ...item, center }
          })
        }

        this.fitEvents() //控制事件显示
      } catch (error) {
        console.log(error)
      }
    },
    renderEventClusterMarker(context) {
      console.log('绘制事件-聚合绘制', context)
      this.setMarkerAndListener(context.marker, true) //设置marker和添加监听
      context.marker.setContent(`<div class="jc-marker-content jc-marker-cluster" style="background-image: url(${JcEventIcons.cluster});">${context.count}</div>`)
    },
    renderEventMarker(context) {
      console.log('绘制事件-单点绘制', context)
      let key = this.getKeyByLngLat(context.data[0].lnglat.lng, context.data[0].lnglat.lat)

      let eventItem = eventData.events[key]

      //过滤掉事件信息为空的场景
      if (!eventItem) {
        return
      }

      let content = `<div class="jc-marker-content" style="background-image: url(${JcEventIcons.plain});">`

      // 事件标题
      if (this.eventTipVisible) {
        content += `<div class="jc-marker-title">${eventItem.eventTitle}</div>`
      }

      this.setMarkerAndListener(context.marker) //设置marker和添加监听
      context.marker.setContent(content + '</div>')
    },
    markerEventClusterClick(context) {
      console.log('绘制事件-点击', context)
      let myJcMap = this.getMyJcMap() //获取地图对象

      //处理数据，如果是单个则去通知显示详情，是多个的聚合，则定位到显示
      if (context.clusterData.length > 1) {
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
        //如果该坐标事件存在，且不是当前事件，则将该事件位置进行偏差，再次进行处理
        return this.getEventCenterAndKey(parseFloat(lng) + 0.000001, parseFloat(lat) + 0.000001, eventId)
      }

      return { center, key }
    },
    fitEvents() {
      let myJcMap = this.getMyJcMap() //获取地图对象

      if (this.eventSignVisible && this.eventTogetherVisible) {
        if (eventData.markerCluster) {
          eventData.markerCluster.setData(eventData.lnglats)
        } else {
          eventData.markerCluster = new MarkerCluster(null, eventData.lnglats, {
            maxZoom: 18,
            gridSize: 120,
            renderClusterMarker: this.renderEventClusterMarker,
            renderMarker: this.renderEventMarker
          })
          eventData.markerCluster.on('click', this.markerEventClusterClick)
        }
        eventData.markerCluster.setMap(myJcMap.map)
        eventData.markerCluster.setGridSize(120) //处理是否显示标题，以及状态
      } else if (eventData.markerCluster) {
        eventData.markerCluster.setMap(null)
        eventData.markerCluster = null
      }

      let jcSignVisible = !this.eventTogetherVisible && this.eventSignVisible

      for (let key in eventData.events) {
        let signItem = eventData.events[key]

        if (jcSignVisible) {
          if (signItem.labelMarker) {
            signItem.labelMarker.titleVisible = this.eventTipVisible
            signItem.labelMarker.show()
          } else {
            signItem.labelMarker = new JcMapMarker({
              id: signItem.id,
              icon: JcEventIcons.plain,
              map: myJcMap,
              zIndex: MAP_SIGN_ZINDEX.OTHER,
              name: this.getMarkerTitle(signItem.eventTitle),
              position: signItem.center,
              titleVisible: this.eventTipVisible
            })
            signItem.labelMarker.on(MAP_EVENT.CLICK, ()=> {
              this.$EventBus.$emit('view-component-change', { component: 'MessageDetail', options: { id: signItem.id, type: MESSAGE_TYPE.EVENT } }) // 通知窗口改变
            })
          }
        } else if (signItem.labelMarker) {
          signItem.labelMarker.hide()
        }
      }
    },
    clearEvents() {
      //清除所有数据
      if (eventData && eventData.markerCluster) {
        eventData.markerCluster.setMap(null)
      }

      for (let key in eventData.events) {
        if (eventData.events[key].labelMarker) {
          eventData.events[key].labelMarker.hide()
        }
      }

      eventData = { markerCluster: null, events: {}, lnglats: [] }
    },
    eventShowWordChange(words) {
      let eventTipVisible = words.includes('event')

      if (this.eventTipVisible == eventTipVisible) {
        return
      }
      this.eventTipVisible = eventTipVisible
      this.fitEvents()
    },
    eventTogetherChange(togethers) {
      let eventTogetherVisible = togethers.includes('event')

      if (this.eventTogetherVisible == eventTogetherVisible) {
        return
      }
      this.eventTogetherVisible = eventTogetherVisible
      this.fitEvents()
    },
    eventShowSignChange(signs) {
      let eventSignVisible = signs.includes('event')

      if (this.eventSignVisible == eventSignVisible) {
        return
      }
      this.eventSignVisible = eventSignVisible
      this.initEventData()
    }
  },
  beforeDestroy() {
    this.clearEvents()
    this.$EventBus.$off('org-change', this.eventOrgChange)
    this.$EventBus.$off('show-sign-change', this.eventShowSignChange)
    this.$EventBus.$off('show-word-change', this.eventShowWordChange)
    this.$EventBus.$off('show-together-change', this.eventTogetherChange)
  }
}
