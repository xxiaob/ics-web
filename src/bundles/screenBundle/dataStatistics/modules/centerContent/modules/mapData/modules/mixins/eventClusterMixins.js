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
      eventTypes: {
        cityEnvironment: { name: '市容环境', color: '#3b7afd' }, advertising: { name: '宣传广告', color: '#9e4bfb' }, constructionManage: { name: '施工管理', color: '#ffbc07' },
        streetOrder: { name: '街面秩序', color: '#19cfed' }, emergency: { name: '突发事件', color: '#ff4b9b' }, otherEvents: { name: '其他事件', color: '#48f754' }
      }
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
              let polygon = new AMap.Polygon({ map: myJcMap, strokeWeight: 1, strokeColor: '#006cff', strokeOpacity: 0.5, fillColor: '#001e86', fillOpacity: 0.3, path: item.path })

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

      let AMap = this.getAMap()

      let myJcMap = this.getMyJcMap()

      let orgAreas = this.getOrgAreasData()

      for (let orgId in orgAreas) {
        if (orgId != this.orgId) {
          let areaItem = orgAreas[orgId], content = this.getEventClusterContent()

          if (areaItem.eventClusterMarker) {
            areaItem.eventClusterMarker.setContent(content)
            areaItem.eventClusterMarker.setMap(myJcMap)
          } else {
            areaItem.eventClusterMarker = new AMap.Marker({ position: areaItem.center, anchor: 'bottom-center', offset: new AMap.Pixel(0, 0), content })
          }
        }
      }
    },
    getEventClusterContent() {
      //获取marker数据
      return '<div class="jc-event-cluster"></div>'
    },
    async getEventClusterata() {
      //获取热力图数据
      if (eventClusterData[this.eventClusterType]) {
        return eventClusterData[this.eventClusterType]
      }
      let endTime = new Date().getTime()

      let beginTime = endTime - timeDis[this.eventClusterType]

      let list = []

      try {
        let result = await getEventAggregation({ beginTime: formatDate(beginTime), endTime: formatDate(endTime), projectId: this.project.projectId })

        if (result && result.length) {
          //处理数据
        }
        eventClusterData[this.eventClusterType] = list
      } catch (error) {
        console.log(error)
      }
      return list
    },
    switchEventClusterType(type) {
      this.eventClusterType = type
      this.showEventClusterMarker()
    }
  }
}
