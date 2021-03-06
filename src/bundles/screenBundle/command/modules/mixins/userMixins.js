/**
 * 用户信息混入
 */
import { getMarkerCluster, getMouseTool } from '@/map/aMap/aMapUtil'
import { JcUserIcons } from '@/config/JcIconConfig'
import { VOICE_TYPE } from '@/config/JcVoiceAlertConfig'
import { JcMapMarker } from '@/map'
import { MAP_EVENT, MAP_SIGN_ZINDEX } from '@/constant/CONST'
import { SYSTEM_ALARM_STATUS } from '@/constant/Dictionaries'


let usersData = { markerCluster: null, users: {}, lnglats: [] } //存储用户信息

let MarkerCluster //存储 MarkerCluster

let MouseTool = null //存储 MouseTool对象

let userMouseTool //用户鼠标操作

let abnormalUserTimes = [] //记录所有异常的用户时间，用于重置

export default {
  data() {
    return {
      gatherUserIds: [], //正在采集的用户id 数组
      abnormalUserIds: [], //异常的用户id 数组
      userSignVisible: false, //用户是否显示
      userTipVisible: false, //用户名称是否显示
      userTogetherVisible: false, //用户是否聚合
      locationUserId: null //定位的用户id
    }
  },
  created() {
    this.$EventBus.$on('map-user-change', this.userMap) //监听用户改变
    this.$EventBus.$on('screen-user-location', this.userLocation) //监听用户定位
    this.$EventBus.$on('show-sign-change', this.userShowSignChange) //过滤信息显示
    this.$EventBus.$on('screen-use-select', this.userSelect) //监听框选用户

    this.abnormalUserinterval = setInterval(this.abnormalUserChange, 2000) //异常用户 超时没有推送 改变状态
  },
  methods: {
    abnormalUserChange() {
      let repaint = false
      const nowTime = new Date().getTime()
      const intervalTime = 10 * 60 * 1000

      for (const key in abnormalUserTimes) {
        if (nowTime - abnormalUserTimes[key] >= intervalTime) {
          const index = this.abnormalUserIds.indexOf(key)

          this.abnormalUserIds.splice(index, 1)
          repaint = true
        }
      }
      if (repaint) {
        this.fitUsers()
      }
    },
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
    userMap(data) {
      // console.log('userMap', data)
      if (data.type == 1) {
        //如果是重新初始化，则清除之前的用户显示
        this.clearUsers()
      } else if (data.type == 3) {
        //如果是用户离线，则从用户列表里删除
        data.offUserIds.forEach(offUserId => {
          for (let key in usersData.users) {
            if (usersData.users[key].userId == offUserId) {
              if (usersData.users[key].labelMarker) {
                usersData.users[key].labelMarker.hide()
              }
              delete usersData.users[key]
              break
            }
          }
          for (let i = 0; i < usersData.lnglats.length; i++) {
            if (usersData.lnglats[i].userId == offUserId) {
              usersData.lnglats.splice(i, 1)
              break
            }
          }
          let index = this.gatherUserIds.indexOf(offUserId)

          if (index > -1) {
            this.gatherUserIds.splice(index, 1)
          }
        })
      } else if (data.type == 4) {
        //是否再一键采集中，如果正在一键采集则显示状态，结束采集则恢复状态
        let index = this.gatherUserIds.indexOf(data.collectUser.userId)

        if (data.collectUser.off && index > -1) {
          this.gatherUserIds.splice(index, 1)
        }
        if (!data.collectUser.off && index < 0) {
          this.gatherUserIds.push(data.collectUser.userId)
        }
      } else if (data.type == 5) {
        //用户考勤状态更新
        if (data.attendance && data.attendance.length) {
          let hasAbnormalUser = false //记录获取的批量用户里是否有新增，如果有，则通知播放提示音

          data.attendance.forEach(item => {
            //记录异常报警的时间
            if (item.status == SYSTEM_ALARM_STATUS.OPEN) {
              abnormalUserTimes[item.id] = new Date().getTime()
            }

            let index = this.abnormalUserIds.indexOf(item.id)

            //如果异常用户列表，用户存在，用户为正常，则从异常列表移除，如果用户不存在，异常，则增加
            if (index > -1) {
              if (item.status == SYSTEM_ALARM_STATUS.CLOSE) {
                this.abnormalUserIds.splice(index, 1)
              }
            } else if (item.status == SYSTEM_ALARM_STATUS.OPEN) {
              this.abnormalUserIds.push(item.id)
              hasAbnormalUser = true
            }
          })

          if (hasAbnormalUser && !data.init) {
            this.$EventBus.$emit('map-voice-alert', { type: VOICE_TYPE.USER_ABNORMAL }) //通知播放提示音
          }
        }
      }
      //处理用户信息
      if (data.users && data.users.length) {
        data.users.forEach(item => {
          //计算用户的中心点和key，处理用户坐标相同的情况
          let { center, key } = this.getUserCenterAndKey(item.lng, item.lat, item.userId)

          //查找该用户使用已经存在，如果存在则更新，否则进行添加
          let lnglat = usersData.lnglats.find(user => user.userId == item.userId)

          let labelMarker = null //记录用户的marker

          if (lnglat) {
            if (usersData.users[lnglat.key] && usersData.users[lnglat.key].labelMarker) {
              labelMarker = usersData.users[lnglat.key].labelMarker
            }
            delete usersData.users[lnglat.key]
            lnglat.lnglat = center
            lnglat.key = key
          } else {
            usersData.lnglats.push({ lnglat: center, key, userId: item.userId })
          }
          usersData.users[key] = { ...item, center, labelMarker }
        })
      }

      this.fitUsers() //控制用户显示
    },
    getUserCenterAndKey(lng, lat, userId) {
      let center = [parseFloat(lng).toFixed(6), parseFloat(lat).toFixed(6)]

      let key = center.join(',')

      //处理是已经有用户和当前用户位置完全相同，如果相同则进行处理偏差处理
      let user = usersData.users[key]

      if (user && user.userId != userId) {
        //如果该坐标用户存在，且不是当前用户，则将该用户位置进行偏差，再次进行处理
        return this.getUserCenterAndKey(parseFloat(lng) + 0.000001, parseFloat(lat) + 0.000001, userId)
      }

      return { center, key }
    },
    async fitUsers() {
      let myJcMap = this.getMyJcMap() //获取地图对象

      if (this.userSignVisible && this.userTogetherVisible) {
        if (usersData.markerCluster) {
          //如果已经存在，则去调整数据显示
          usersData.markerCluster.setData(usersData.lnglats)
        } else {
          MarkerCluster = await getMarkerCluster() //获取 MarkerCluster 对象
          usersData.markerCluster = new MarkerCluster(null, usersData.lnglats, {
            maxZoom: 18,
            gridSize: 120,
            renderClusterMarker: this.renderUserClusterMarker,
            renderMarker: this.renderUserMarker
          })
          usersData.markerCluster.on('click', this.markerUserClusterClick)
        }

        usersData.markerCluster.setMap(myJcMap.map)
        usersData.markerCluster.setGridSize(120) //处理是否显示标题，以及状态
      } else if (usersData.markerCluster) {
        usersData.markerCluster.setMap(null)
        usersData.markerCluster = null
      }
      //处理用户非聚合显示
      let jcSignVisible = !this.userTogetherVisible && this.userSignVisible

      for (let key in usersData.users) {
        let signItem = usersData.users[key]

        if (jcSignVisible) {
          let signIcon = this.getUserIcon(signItem)

          if (signItem.labelMarker) {
            signItem.labelMarker.icon = signIcon
            signItem.labelMarker.titleVisible = this.userTipVisible
            signItem.labelMarker.show(signItem.center)
          } else {
            signItem.labelMarker = new JcMapMarker({
              id: signItem.areaId,
              icon: signIcon,
              map: myJcMap,
              zIndex: MAP_SIGN_ZINDEX.USER,
              name: signItem.userName,
              position: signItem.center,
              titleVisible: this.userTipVisible
            })
            signItem.labelMarker.on(MAP_EVENT.CLICK, ()=> {
              this.$EventBus.$emit('view-component-change', { component: 'UserDetail', options: {
                userId: signItem.userId, userName: signItem.userName,
                center: signItem.center
              } }) //通知窗口改变
            })
          }
          if (signItem.userId == this.locationUserId) {
            signItem.labelMarker.marker.setTop(true)
          } else {
            signItem.labelMarker.marker.setzIndex(5)
          }
        } else if (signItem.labelMarker) {
          signItem.labelMarker.hide()
        }
      }
    },
    renderUserClusterMarker(context) {
      console.log('绘制用户-聚合绘制', context)
      this.setMarkerAndListener(context.marker, true) //设置marker和添加监听
      context.marker.setContent(`<div class="jc-marker-content jc-marker-cluster" style="background-image: url(${JcUserIcons.cluster});">${context.count}</div>`)
    },
    renderUserMarker(context) {
      console.log('绘制用户-单点绘制', context)
      let key = this.getKeyByLngLat(context.data[0].lnglat.lng, context.data[0].lnglat.lat)

      let userItem = usersData.users[key]

      //过滤掉用户信息为空的场景
      if (!userItem) {
        return ''
      }

      let content = `<div class="jc-marker-content" style="background-image: url(${this.getUserIcon(userItem)});">`

      if (this.userTipVisible) {
        content += `<div class="jc-marker-title">${userItem.userName}</div>`
      }

      //如果是定位的用户，则突出显示
      if (userItem.userId == this.locationUserId) {
        context.marker.setTop(true)
      } else {
        context.marker.setzIndex(MAP_SIGN_ZINDEX.USER)
      }
      this.setMarkerAndListener(context.marker) //设置marker和添加监听
      context.marker.setContent(content + '</div>')
    },
    getUserIcon(user) {
      if (this.abnormalUserIds.includes(user.userId)) {
        return JcUserIcons.abnormal
      }
      if (this.gatherUserIds.includes(user.userId)) {
        return JcUserIcons.gather
      }
      return user.photo && JcUserIcons.icons[user.photo] ? JcUserIcons.icons[user.photo].icon : JcUserIcons.online
    },
    markerUserClusterClick(context) {
      console.log('绘制用户-点击', context)
      let myJcMap = this.getMyJcMap() //获取地图对象

      //处理数据，如果是单个则去通知显示详情，是多个的聚合，则定位到显示
      if (context.clusterData.length > 1) {
        myJcMap.map.setBounds(this.getAmapBundles(context.clusterData))
      } else {
        //获取信息去通知显示详情
        let key = this.getKeyByLngLat(context.lnglat.lng, context.lnglat.lat)

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
      for (let key in usersData.users) {
        if (usersData.users[key].labelMarker) {
          usersData.users[key].labelMarker.hide()
        }
      }
      this.gatherUserIds = [] //重置用户聚合id数组
      this.abnormalUserIds = [] //重置用户异常id数组

      usersData = { markerCluster: null, users: {}, lnglats: [] }
    },
    userLocation(data) {
      //用户定位id
      let noUser = true //处理是否有用户

      if (this.userSignVisible) {
        //查找该用户使用已经存在，如果存在则更新，否则进行添加
        let lnglat = usersData.lnglats.find(user => user.userId == data.id)

        if (lnglat) {
          this.locationUserId = data.id
          let myJcMap = this.getMyJcMap() //获取地图对象

          myJcMap.map.setZoomAndCenter(20, lnglat.lnglat)
          noUser = false //设置查找到该用户
        }
      }
      if (noUser) {
        this.$message.error('用户不在线或未显示')
      }
    },
    userShowSignChange(data) {
      let neetFit = false

      //处理标题
      let userTipVisible = data.words.includes('user')

      if (this.userTipVisible != userTipVisible) {
        this.userTipVisible = userTipVisible
        neetFit = true
      }

      //处理聚合
      let userTogetherVisible = data.togethers.includes('user')

      if (this.userTogetherVisible != userTogetherVisible) {
        this.userTogetherVisible = userTogetherVisible
        neetFit = true
      }

      //处理实体
      let userSignVisible = data.signs.includes('user')

      if (this.userSignVisible != userSignVisible) {
        this.userSignVisible = userSignVisible
        neetFit = true
      }

      if (neetFit) {
        this.fitUsers()
      }
    }
  },
  beforeDestroy() {
    this.clearUsers() //清除基础数据
    userMouseTool = null
    //去除事件监听
    this.$EventBus.$off('map-user-change', this.userMap)
    this.$EventBus.$off('screen-user-location', this.userLocation)
    this.$EventBus.$off('show-sign-change', this.userShowSignChange)
    this.$EventBus.$off('screen-use-select', this.userSelect)
    if (this.abnormalUserinterval) {
      clearInterval(this.abnormalUserinterval)
    }
  }
}
