/**
 * 用户信息混入
 */
import { getMarkerCluster, getMouseTool } from '@/map/aMap/aMapUtil'
import { JcUserIcons } from '@/config/JcIconConfig'

let usersData = { markerCluster: null, users: {}, lnglats: [] } //存储用户信息

let MarkerCluster //存储 MarkerCluster

let MouseTool = null //存储 MouseTool对象

let userMouseTool //用户鼠标操作

export default {
  data() {
    return {
      gatherUserIds: [], //正在采集的用户id 数组
      userTipVisible: true, //用户是否显示
      togetherVisible: true, //用户是否聚合
      locationUserId: null //定位的用户id
    }
  },
  created() {
    this.$EventBus.$on('map-user-change', this.userMap) //监听用户改变
    this.$EventBus.$on('screen-user-location', this.userLocation) //监听用户定位
    this.$EventBus.$on('show-word-change', this.userShowWordChange) //监听文字显示切换
    this.$EventBus.$on('show-together-change', this.userTogetherChange) //监听聚合显示改变
    this.$EventBus.$on('screen-use-select', this.userSelect) //监听框选用户
  },
  methods: {
    async userSelect(data) {
      //用户框选
      let myJcMap = this.getMyJcMap() //获取地图对象

      if (myJcMap) {
        if (data.isSelect) {
          //如果开始框选，先判断对象是否存在，如果不存在则创建
          if (!userMouseTool) {
            MouseTool = MouseTool || await getMouseTool()
            userMouseTool = new MouseTool(myJcMap.map)
            userMouseTool.on('draw', (e) => {
              let rectEl = e.obj

              //处理判断在绘图矩形内的用户
              let usedIds = []

              if (usersData && usersData.users) {
                for (let key in usersData.users) {
                  let item = usersData.users[key]

                  if (rectEl.contains(item.center)) {
                    usedIds.push(item.userId)
                  }
                }
              }

              myJcMap.map.remove(myJcMap.map.getAllOverlays('rectangle')) //清除框选的框
              if (usedIds.length) {
                this.$EventBus.$emit('view-component-change', { component: 'CommandOrg', options: usedIds }) //通知窗口改变
              }
              console.log('框选的用户：', usedIds)
            })
          }
          userMouseTool.rectangle({ strokeWeight: 1, strokeColor: '#fc005b', fillOpacity: 0, strokeStyle: 'dashed' })
        } else if (userMouseTool) {
          //如果结束框选，且工具存在则关闭
          userMouseTool.close(true)
        }
      } else {
        this.$message.error('地图初始化中，请稍后')
      }
    },
    async userMap(data) {
      MarkerCluster = await getMarkerCluster() //获取 MarkerCluster 对象

      if (data.type == 1) {
        //如果是重新初始化，则清除之前的用户显示
        this.clearUsers()
      } else if (data.type == 3) {
        //如果是用户离线，则从用户列表里删除
        for (let key in usersData.users) {
          if (usersData.users[key].userId == data.offUserId) {
            delete usersData.users[key]
            break
          }
        }
        for (let i = 0; i < usersData.lnglats.length; i++) {
          if (usersData.lnglats[i].userId == data.offUserId) {
            usersData.lnglats.splice(i, 1)
            break
          }
        }
      } else if (data.type == 4) {
        //是否再一键采集中，如果正在一键采集则显示状态，结束采集则恢复状态
        let index = this.gatherUserIds.indexOf(data.collectUser.userId)

        if (data.collectUser.off && index > -1) {
          this.gatherUserIds.splice(index, 1)
        }
        if (!data.collectUser.off && index < 0) {
          this.gatherUserIds.push(data.collectUser.userId)
        }
      }
      //处理用户信息
      if (data.users && data.users.length) {
        data.users.forEach(item => {
          let center = [parseFloat(item.lng).toFixed(9), parseFloat(item.lat).toFixed(9)]

          //查找该用户使用已经存在，如果存在则更新，否则进行添加
          let lnglat = usersData.lnglats.find(user => user.userId == item.userId)

          if (lnglat) {
            delete usersData.users[lnglat.key]
            lnglat.lnglat = center
          } else {
            usersData.lnglats.push({ lnglat: center, key: center.join(','), userId: item.userId })
          }
          usersData.users[center.join(',')] = { ...item, center }
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
        //处理是否显示标题，以及状态
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
      let key = parseFloat(context.data[0].lnglat.lng).toFixed(9) + ',' + parseFloat(context.data[0].lnglat.lat).toFixed(9)

      let userItem = usersData.users[key]

      let content = '<div class="jc-marker-content">'

      if (this.userTipVisible) {
        content += `<div class="jc-marker-title">${userItem.userName}</div>`
      }
      if (this.gatherUserIds.includes(userItem.userId)) {
        content += `<img src=${JcUserIcons.gather} class="jc-marker-icon"/></div>`
      } else {
        content += `<img src=${JcUserIcons.online} class="jc-marker-icon"/></div>`
      }

      //如果是定位的用户，则突出显示
      if (userItem.userId == this.locationUserId) {
        context.marker.setzIndex(20)
      } else {
        context.marker.setzIndex(18)
      }

      context.marker.setContent(content)
    },
    markerUserClusterClick(context) {
      console.log('绘制用户-点击', context)
      let myJcMap = this.getMyJcMap() //获取地图对象

      //处理数据，如果是单个则去通知显示详情，是多个的聚合，则定位到显示
      if (context.clusterData.length > 1) {
        myJcMap.map.setBounds(this.getAmapBundles(context.clusterData))
      } else {
        //获取信息去通知显示详情
        let key = parseFloat(context.lnglat.lng).toFixed(9) + ',' + parseFloat(context.lnglat.lat).toFixed(9)

        let userItem = usersData.users[key]

        this.$EventBus.$emit('view-component-change', {
          component: 'UserDetail', options: {
            userId: userItem.userId, userName: userItem.userName,
            center: userItem.center
          }
        }) //通知窗口改变
      }
    },
    clearUsers() {
      //清除所有数据
      if (usersData && usersData.markerCluster) {
        usersData.markerCluster.setMap(null)
      }
      usersData = { markerCluster: null, users: {}, lnglats: [] }
    },
    userLocation(data) {
      //用户定位id
      let noUser = true //处理是否有用户

      if (this.userTipVisible) {
        //查找该用户使用已经存在，如果存在则更新，否则进行添加
        let lnglat = usersData.lnglats.find(user => user.userId == data.id)

        if (lnglat) {
          this.locationUserId = data.id
          let myJcMap = this.getMyJcMap() //获取地图对象

          myJcMap.map.setZoomAndCenter(18, lnglat.key.split(','))
          noUser = false //设置查找到该用户
        }
      }
      if (noUser) {
        this.$message.error('用户不在线或未显示')
      }
    },
    userShowWordChange(words) {
      this.userTipVisible = words.includes('user') //如果存在用户显示，则显示用户，否则不显示
      this.fitUsers()
    },
    userTogetherChange(togethers) {
      this.togetherVisible = togethers.includes('user') //如果存在用户聚合，则聚合用户，否则不显示
      this.fitUsers()
    }
  },
  beforeDestroy() {
    this.clearUsers() //清除基础数据
    userMouseTool = null
    //去除事件监听
    this.$EventBus.$off('map-user-change', this.userMap)
    this.$EventBus.$off('screen-user-location', this.userLocation) //监听用户定位
    this.$EventBus.$off('show-word-change', this.orgShowWordChange)
    this.$EventBus.$off('show-together-change', this.userTogetherChange)
    this.$EventBus.$off('screen-use-select', this.userSelect)
  }
}
