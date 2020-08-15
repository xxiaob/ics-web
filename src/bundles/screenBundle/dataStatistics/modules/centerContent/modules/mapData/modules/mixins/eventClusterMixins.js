/**
 * 事件聚合显示
 */
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
    },
    hideEventCluster() {

    },
    switchEventClusterType(type) {
      this.eventClusterType = type
    }
  }
}
