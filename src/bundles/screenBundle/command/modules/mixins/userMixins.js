/**
 * 用户信息混入
 */
import { getMarkerCluster } from '@/map/aMap/aMapUtil'
import { JcUserIcons } from '@/config/JcIconConfig'

let usersData = null //存储用户信息 例如数据： {markerCluster: MarkerCluster, signs: {'59242618223067136': {}}}

let MarkerCluster //存储 MarkerCluster

export default {
  data() {
    return {
      userOrg: null,
      userTipVisible: true, //用户是否显示
      togetherVisible: true //用户是否聚合
    }
  },
  created() {
    this.$EventBus.$on('map-user-change', this.userMap) //监听行级别切换
    this.$EventBus.$on('show-word-change', this.userShowWordChange) //监听文字显示切换
    this.$EventBus.$on('show-together-change', this.userTogetherChange) //监听聚合显示改变
  },
  methods: {
    async userMap(data) {
      MarkerCluster = await getMarkerCluster() //获取 MarkerCluster 对象
      //如果是重新初始化，则清除之前的用户显示
      if (data.type == 1) {
        this.clearUsers()
      }
      usersData = usersData || { markerCluster: null, users: {}, lnglats: [] }
      //处理用户信息
      if (data.users && data.users.length) {
        data.users.forEach(item => {
          let center = [item.lng, item.lat]

          usersData.users[center.join(',')] = item
          usersData.lnglats.push({ lnglat: center })
        })
      }
      if (usersData.markerCluster) {
        //如果已经存在，则去调整数据显示
        usersData.markerCluster.setData(usersData.lnglats)
      } else {
        usersData.markerCluster = new MarkerCluster(null, usersData.lnglats, {
          userSize: 60,
          renderClusterMarker: this.renderUserClusterMarker,
          renderMarker: this.renderUserMarker
        })
        usersData.markerCluster.on('click', this.markerUserClusterClick)
      }
      this.fitUsers() //控制用户显示
    },
    fitUsers() {
      if (!usersData.markerCluster) {
        return
      }
      let myJcMap = this.getMyJcMap() //获取地图对象

      //处理用户是否显示
      if (this.userTipVisible) {
        usersData.markerCluster.setMap(myJcMap.map)

        //处理是否进行聚合
        if (this.togetherVisible) {
          usersData.markerCluster.setMaxZoom(18)
        } else {
          usersData.markerCluster.setMaxZoom(0)
        }
        //处理是否显示标题
        usersData.markerCluster.setGridSize(120)
      } else {
        usersData.markerCluster.setMap(null)
      }
    },
    renderUserClusterMarker(context) {
      console.log('绘制用户-聚合绘制', context)
      context.marker.setAnchor('center')
      context.marker.setzIndex(20)
      context.marker.setContent(`<div class="jc-cluster-content" style="background-image: url(${JcUserIcons.cluster});">${context.count}</div>`)
    },
    renderUserMarker(context) {
      console.log('绘制用户-单点绘制', context)
      let key = context.data[0].lnglat.lng + ',' + context.data[0].lnglat.lat

      let userItem = usersData.users[key]

      let content = '<div class="jc-marker-content">'

      if (this.userTipVisible) {
        content += `<div class="jc-marker-title">${userItem.userName}</div>`
      }
      content += `<img src=${JcUserIcons.online} class="jc-marker-icon"/></div>`
      context.marker.setzIndex(20)
      context.marker.setContent(content)
    },
    markerUserClusterClick(context) {
      console.log('绘制用户-点击', context)
      let myJcMap = this.getMyJcMap() //获取地图对象

      // myJcMap.map.setFitView(context.clusterData)
    },
    clearUsers() {
      //清除所有数据
      if (usersData && usersData.markerCluster) {
        usersData.markerCluster.setMap(null)
      }
      usersData = null
    },
    userShowWordChange(words) {
      this.userTipVisible = words.indexOf('user') > -1 //如果存在用户显示，则显示用户，否则不显示
      this.fitUsers()
    },
    userTogetherChange(togethers) {
      this.togetherVisible = togethers.indexOf('user') > -1 //如果存在用户聚合，则聚合用户，否则不显示
      this.fitUsers()
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('map-user-change', this.userMap)
    this.$EventBus.$off('show-word-change', this.orgShowWordChange)
    this.$EventBus.$off('show-together-change', this.userTogetherChange)
  }
}
