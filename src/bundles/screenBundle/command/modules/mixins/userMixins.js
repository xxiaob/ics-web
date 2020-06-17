/**
 * 用户信息混入
 */
import { areaList } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { JcMapSign } from '@/map'
import { getMarkerCluster } from '@/map/aMap/aMapUtil'
import { JcIcons } from '@/config/JcIconConfig'

let userData = {} //存储已经请求的组织数据

let userAreas = {} //网格区域数组，例如数据： {'caichang': {markerCluster: MarkerCluster, signs: {'59242618223067136': {}}}}

let MarkerCluster //存储 MarkerCluster

export default {
  data() {
    return {
      userOrg: null,
      userTipVisible: false, //用户是否显示
      userAreaVisible: true //组织是否显示区域
    }
  },
  created() {
    // this.$EventBus.$on('org-change', this.userMap) //监听行级别切换
    this.$EventBus.$on('show-area-change', this.userShowAreaChange) //监听区域显示切换
    this.$EventBus.$on('show-word-change', this.userShowWordChange) //监听文字显示切换
    this.$EventBus.$on('show-together-change', this.userTogetherChange) //监听聚合显示改变
  },
  methods: {
    async areaMap(org) {
      MarkerCluster = await getMarkerCluster() //获取 MarkerCluster 对象
      //处理地图
      this.userOrg = org
      console.log('指挥层级切换变化', org)
      try {
        let res = userData[this.userOrg.orgId]

        if (!(res && res.length)) {
          res = await areaList({ orgId: this.userOrg.orgId, projectId: this.project.projectId, orgSearchType: AREAS_TYPE.OWN_AND_CHILD, searchType: AREAS_SEARCH_TYPE.user })

          userData[this.userOrg.orgId] = res
        }

        this.formatusers(res)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 转换网格数据
     * @param {Array} data 组织区域数据
     */
    formatusers(data) {
      this.clearusers() //清除所有数据

      let myJcMap = this.getMyJcMap() //获取地图对象

      console.log('网格信息', data)
      if (data && data.length) {
        data.forEach(item => {
          let userTypeMap = userAreas[item.areaTypeId] || { icon: item.icon, signs: {}, lnglats: [] }

          userTypeMap.signs[item.center] = {
            areaId: item.areaId, areaName: item.areaName, areaTypeId: item.areaTypeId, center: item.center, icon: item.icon, sign: new JcMapSign({
              id: item.orgId,
              map: myJcMap,
              name: item.areaName,
              center: item.center.split(','),
              tipVisible: false,
              areaVisible: false,
              boundaries: apiBoundariesFormat(item)
            })
          }

          userTypeMap.lnglats.push({ lnglat: item.center.split(',') })

          userAreas[item.areaTypeId] = userTypeMap
        })
      }
      console.log('绘制网格-处理之后的数据', userAreas)
      this.drawusers() //绘画网格数据
    },
    /**
     * 绘画网格数据
     */
    drawusers() {
      let mapuserTypes = []

      for (let type in userAreas) {
        mapuserTypes.push(type)
        let userTypeMap = userAreas[type]

        userTypeMap.markerCluster = this.getMarkerCluster(userTypeMap)
        userTypeMap.markerCluster.on('click', this.markerClusterClick)
      }
      this.areaTipVisibles = mapuserTypes
      this.togetherVisibles = mapuserTypes
      this.$EventBus.$emit('map-user-types-change', mapuserTypes) //通知地图存在类型
      this.fitusers() //画出网格
    },
    fitusers() {
      let myJcMap = this.getMyJcMap() //获取地图对象

      for (let type in userAreas) {
        let userTypeMap = userAreas[type]

        //处理聚合是否显示
        if (this.areaTipVisibles.indexOf(type) > -1) {
          userTypeMap.markerCluster.setMap(myJcMap.map)

          //处理是否进行聚合
          if (this.togetherVisibles.indexOf(type) > -1) {
            userTypeMap.markerCluster.setMaxZoom(18)
          } else {
            userTypeMap.markerCluster.setMaxZoom(0)
          }
          //处理是否显示标题
          userTypeMap.markerCluster.setuserSize(120)
        } else {
          userTypeMap.markerCluster.setMap(null)
        }

        //地图区域显示控制
        let showSign = this.areaAreaVisibles.indexOf(type) > -1

        for (let key in userTypeMap.signs) {
          if (showSign) {
            userTypeMap.signs[key].sign.areaVisible = true
            userTypeMap.signs[key].sign.setMap(myJcMap)
          } else {
            userTypeMap.signs[key].sign.setMap(null)
          }
        }
      }
    },
    getMarkerCluster(userTypeMap) {
      return new MarkerCluster(null, userTypeMap.lnglats, {
        userSize: 120,
        renderClusterMarker: (context) => {
          this.renderClusterMarker(userTypeMap, context)
        },
        renderMarker: (context) => {
          this.renderMarker(userTypeMap, context)
        }
      })
    },
    renderClusterMarker(userTypeMap, context) {
      console.log('绘制网格-聚合绘制', context)
      context.marker.setAnchor('center')
      context.marker.setContent(`<div class="jc-cluster-content" style="background-image: url(${JcIcons[userTypeMap.icon].cluster});">${context.count}</div>`)
    },
    renderMarker(userTypeMap, context) {
      console.log('绘制网格-单点绘制', context)
      let key = context.data[0].lnglat.lng + ',' + context.data[0].lnglat.lat

      let signItem = userTypeMap.signs[key]

      let content = '<div class="jc-marker-content">'

      if (this.areaTipVisibles.indexOf(signItem.areaTypeId) > -1) {
        content += `<div class="jc-marker-title">${signItem.areaName}</div>`
      }
      content += `<img src=${JcIcons[signItem.icon].icon} class="jc-marker-icon"/></div>`
      context.marker.setContent(content)
    },
    markerClusterClick(context) {
      console.log('绘制网格-点击', context)
      let myJcMap = this.getMyJcMap() //获取地图对象

      myJcMap.map.setFitView(context.marker)
    },
    clearusers() {
      //清除所有数据
    },
    userShowAreaChange(areas) {
      //组织区域显示
      this.areaAreaVisibles = [...areas]
      this.fitusers()
    },
    userShowWordChange(words) {
      //组织文字显示
      this.areaTipVisibles = [...words]

      this.fitusers()
    },
    userTogetherChange(togethers) {
      //聚合显示控制
      this.togetherVisibles = [...togethers]
      this.fitusers()
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('org-change', this.userMap)
    this.$EventBus.$off('show-area-change', this.orgShowAreaChange)
    this.$EventBus.$off('show-word-change', this.orgShowWordChange)
    this.$EventBus.$off('show-together-change', this.userTogetherChange)
  }
}
