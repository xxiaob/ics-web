/**
 * 事件热力混入
 */
import { eventHeatMap } from '@/api/dataScreen'
import { formatDate } from '@/libs/util'

let eventHotMap //个人 map 对象,存储Amap对象

let eventHotMapData = {} //存储已经请求的数据

let timeDis = { month: 1000 * 60 * 60 * 24 * 30, quarter: 1000 * 60 * 60 * 24 * 90, year: 1000 * 60 * 60 * 24 * 365 }

export default {
  data() {
    return {
      eventHotType: 'month' //事件区域维度 1-月 2-季度 3-年
    }
  },
  methods: {
    initEventHotMap() {
      let myJcMap = this.getMyJcMap()

      myJcMap.setPitch(0)
      myJcMap.setFeatures(['bg', 'road', 'point', 'building'])
      if (eventHotMap) {
        eventHotMap.setMap(myJcMap)
      } else {
        let AMap = this.getAMap()

        eventHotMap = new AMap.Heatmap(myJcMap, { radius: 30, opacity: [0, 1] })
      }
      this.switchHotType(this.eventHotType)
    },
    hideEventHotMap() {
      eventHotMap.setMap(null)
    },
    async getEventHotMapData() {
      //获取热力图数据
      if (eventHotMapData[this.eventHotType]) {
        return eventHotMapData[this.eventHotType]
      }
      let endTime = new Date().getTime()

      let beginTime = endTime - timeDis[this.eventHotType]

      let list = []

      try {
        let result = await eventHeatMap({ beginTime: formatDate(beginTime), endTime: formatDate(endTime), projectId: this.project.projectId })

        if (result && result.length) {
          list = result.map(item => {
            return { lng: item.lng * 1 + 0.005, lat: item.lat * 1 + 0.005, count: item.eventCount }
          })
        }
        eventHotMapData[this.eventHotType] = list
      } catch (error) {
        console.log(error)
      }
      return list
    },
    async switchHotType(type) {
      this.eventHotType = type
      let data = await this.getEventHotMapData()

      eventHotMap.setDataSet({ data })
    }
  }
}
