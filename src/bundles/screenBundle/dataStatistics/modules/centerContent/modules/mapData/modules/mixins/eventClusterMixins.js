/**
 * 事件聚合显示
 */
import { getEventAggregation } from '@/api/dataScreen'
import { formatDate } from '@/libs/util'

let eventClusterData = {} //存储已经请求的数据

let timeDis = { month: 1000 * 60 * 60 * 24 * 30, quarter: 1000 * 60 * 60 * 24 * 90, year: 1000 * 60 * 60 * 24 * 365 }

export default {
  data() {
    return {
      eventClusterType: 'month', //事件区域维度 1-月 2-季度 3-年
      eventTypes: [{ name: '市容环境', color: '#3b7afd' }, { name: '宣传广告', color: '#9e4bfb' }, { name: '施工管理', color: '#ffbc07' }, { name: '街面秩序', color: '#19cfed' }, { name: '突发事件', color: '#ff4b9b' }, { name: '其他事件', color: '#48f754' }]
    }
  },
  methods: {
    initEventCluster() {
      //处理如果不是当前显示，则去隐藏自己
      if (this.switchType != 3) {
        this.hideEventCluster()
        return
      }
      let myJcMap = this.getMyJcMap()

      myJcMap.setPitch(0)
      myJcMap.setFeatures(['bg', 'road'])
      this.showPolygons()
      this.switchEventClusterType(this.eventClusterType)
    },
    hideEventCluster() {
      //先隐藏布局
      let orgAreas = this.getOrgAreasData()

      for (let orgId in orgAreas) {
        if (orgId != this.orgId) {
          let areaItem = orgAreas[orgId]

          if (areaItem.polygons) {
            areaItem.polygons.forEach(item => {
              item.setMap(null)
            })
          }
          if (areaItem.eventClusterMarker) {
            areaItem.eventClusterMarker.setMap(null)
          }
        }
      }
    },
    showPolygons() {
      let myJcMap = this.getMyJcMap()

      let AMap = this.getAMap()

      let orgAreas = this.getOrgAreasData()

      for (let orgId in orgAreas) {
        if (orgId != this.orgId) {
          let areaItem = orgAreas[orgId]

          if (areaItem.polygons) {
            areaItem.polygons.forEach(item => {
              item.setMap(myJcMap)
            })
          } else {
            let polygons = []

            areaItem.boundaries.forEach(item => {
              let polygon = new AMap.Polygon({
                map: myJcMap, strokeWeight: 1, strokeColor: '#006cff', strokeOpacity: 0.5,
                fillColor: '#001e86', fillOpacity: 0.3, path: item.path
              })

              polygons.push(polygon)
            })
            areaItem.polygons = polygons
          }
        }
      }
    },
    async showEventClusterMarker() {
      //显示标记
      let data = await this.getEventClusterata()

      if (!data || data.length < 1) {
        return
      }
      let AMap = this.getAMap()

      let myJcMap = this.getMyJcMap()

      let orgAreas = this.getOrgAreasData()

      data.forEach(item => {
        if (item.orgId != this.orgId) {
          let areaItem = orgAreas[item.orgId]

          console.log(areaItem)
          //如果信息不存在，则不进行处理
          if (areaItem && areaItem.center) {
            let content = this.getEventClusterContent(item.eventGroupByEventTypeRespList)

            if (areaItem.eventClusterMarker) {
              areaItem.eventClusterMarker.setContent(content)
              areaItem.eventClusterMarker.setMap(myJcMap)
            } else {
              areaItem.eventClusterMarker = new AMap.Marker({ map: myJcMap, position: areaItem.center, anchor: 'bottom-center', offset: new AMap.Pixel(0, 0), content })
              areaItem.eventClusterMarker.on('mouseover', function (event) {
                event.target.setzIndex(12)
              })
              areaItem.eventClusterMarker.on('mouseout', function (event) {
                event.target.setzIndex(10)
              })
            }
          }
        }
      })
      myJcMap.setFitView(null, true, [0, 0, 0, 0]) //设置自适应显示
    },
    getEventClusterContent(events) {
      //获取marker数据
      let centerHtml = '', colors = []

      //background: conic-gradient( #3b7afd 0 16.7%, #9e4bfb 0 50%, #ffbc07 0 83.3%, #3b7afd 0 100%)
      events.forEach((event, index) => {
        let typeItem = this.eventTypes.find(type => type.name == event.typeName)

        colors.push(typeItem ? typeItem.color : '#48f754')
        centerHtml += `<div class="jc-event-item-${index}">${event.typeCount}</div>`
      })
      let content = `<div class="jc-event-cluster"><div class="jc-event-warp" style="background: conic-gradient(${colors[0]} 0 16.7%, ${colors[1]} 0 50%, ${colors[2]} 0 83.3%, ${colors[0]} 0 100%)">` + centerHtml + '</div></div>'

      return content
    },
    async getEventClusterata() {
      //获取热力图数据
      if (eventClusterData[this.eventClusterType]) {
        return eventClusterData[this.eventClusterType]
      }
      let endTime = new Date().getTime()

      let beginTime = endTime - timeDis[this.eventClusterType]

      try {
        eventClusterData[this.eventClusterType] = await getEventAggregation({ beginTime: formatDate(beginTime), endTime: formatDate(endTime), projectId: this.project.projectId })
      } catch (error) {
        console.log(error)
      }
      return eventClusterData[this.eventClusterType]
    },
    switchEventClusterType(type) {
      this.eventClusterType = type
      this.showEventClusterMarker()
    }
  }
}
