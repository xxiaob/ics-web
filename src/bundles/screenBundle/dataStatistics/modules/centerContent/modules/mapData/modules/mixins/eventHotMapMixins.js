/**
 * 事件热力混入
 */
import { eventHeatMap } from '@/api/dataScreen'

let myJcMap, AMap //个人 map 对象,存储Amap对象,存储3D图层，存储点标记

let eventHotMapdata = {} //存储已经请求的数据

let timeDis = { month: 1000 * 60 * 60 * 24 * 30, quarter: 1000 * 60 * 60 * 24 * 90, year: 1000 * 60 * 60 * 24 * 365 }

export default {
  data() {
    return {
      eventHotType: 'month' //事件区域维度 1-月 2-季度 3-年
    }
  },
  methods: {
    initEventHotMap() {
      myJcMap = this.getMyJcMap()
      AMap = this.getAMap()
      this.getEventHotMapData()
    },
    hideEventHotMap() {

    },
    async getEventHotMapData() {
      //获取热力图数据
      if (eventHotMapdata[this.eventHotType]) {
        return eventHotMapdata[this.eventHotType]
      }
      let endTime = new Date().getTime()

      let beginTime = endTime - timeDis[this.eventHotType]

      try {
        let result = await eventHeatMap({ beginTime, endTime, projectId: this.project.projectId })
      } catch (error) {
        console.log(error)
      }
    },
    switchHotType(type) {
      this.eventHotType = type
    }
  }
}
