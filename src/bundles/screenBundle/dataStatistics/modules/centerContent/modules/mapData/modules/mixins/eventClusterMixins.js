/**
 * 事件聚合显示
 */
let eventClusterData = {} //存储已经请求的数据

let timeDis = { month: 1000 * 60 * 60 * 24 * 30, quarter: 1000 * 60 * 60 * 24 * 90, year: 1000 * 60 * 60 * 24 * 365 }

export default {
  data() {
    return {
      eventClusterType: 'month' //事件区域维度 1-月 2-季度 3-年
    }
  },
  methods: {
    initEventCluster() {
      //处理如果不是当前显示，则去隐藏自己
      if (this.switchType != 3) {
        this.hideEventCluster()
        return
      }
    },
    hideEventCluster() {

    },
    switchEventClusterType(type) {
      this.eventClusterType = type
    }
  }
}
