/**
 * 地图网格处理
 */
import { areaList } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { JcMapSign } from '@/map'
import { getMarkerCluster } from '@/map/aMap/aMapUtil'
import { JcIcons } from '@/config/JcIconConfig'
import { VOICE_TYPE } from '@/config/JcVoiceAlertConfig'

let gridData = {} //存储已经请求的组织数据

let gridAreas = {} //网格区域数组，例如数据： {'caichang': {markerCluster: MarkerCluster, signs: {'59242618223067136': {}}}}

let MarkerCluster //存储 MarkerCluster

export default {
  data() {
    return {
      gridOrg: null,
      abnormalGridIds: [], //异常的网格id 数组
      areaTipVisibles: [], //网格区域对应类型是否显示名称
      areaAreaVisibles: [], //网格区域对应类型是否显示区域
      togetherVisibles: [] //网格区域对应类型是否聚合显示区域
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.areaMap) //监听行级别切换
    this.$EventBus.$on('map-grid-change', this.mapGridChange) //岗点考勤状态变化
    this.$EventBus.$on('screen-grid-location', this.gridLocation) //监听网格定位
    this.$EventBus.$on('show-area-change', this.gridShowAreaChange) //监听区域显示切换
    this.$EventBus.$on('show-word-change', this.gridShowWordChange) //监听文字显示切换
    this.$EventBus.$on('show-together-change', this.gridTogetherChange) //监听聚合显示改变
  },
  methods: {
    mapGridChange(data) {
      if (data.type == 1) {
        //岗点考勤状态更新
        if (data.attendance && data.attendance.length) {
          let hasAbnormalGrid = false //记录获取的批量岗点里是否有新增，如果有，则通知播放提示音

          data.attendance.forEach(item => {
            let index = this.abnormalGridIds.indexOf(item.id)

            //如果异常岗点列表，岗点存在，岗点为正常，则从异常列表移除，如果岗点不存在，异常，则增加
            if (index > -1) {
              if (item.status == 0) {
                this.abnormalGridIds.splice(index, 1)
              }
            } else if (item.status == 1) {
              this.abnormalGridIds.push(item.id)
              hasAbnormalGrid = true
            }
          })

          if (hasAbnormalGrid) {
            this.$EventBus.$emit('map-voice-alert', { type: VOICE_TYPE.GRID_ABNORMAL }) //通知播放提示音
          }
        }
      }
      this.fitGrids()
    },
    async areaMap(org) {
      MarkerCluster = await getMarkerCluster() //获取 MarkerCluster 对象
      //处理地图
      this.gridOrg = org
      console.log('指挥层级切换变化', org)
      try {
        let res = gridData[this.gridOrg.orgId]

        if (!(res && res.length)) {
          res = await areaList({
            orgId: this.gridOrg.orgId, projectId: this.project.projectId,
            orgSearchType: AREAS_TYPE.OWN_AND_BRO, searchType: AREAS_SEARCH_TYPE.SCREEN
          })

          gridData[this.gridOrg.orgId] = res
        }

        this.formatGrids(res)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 转换网格数据
     * @param {Array} data 组织区域数据
     */
    formatGrids(data) {
      this.clearGrids() //清除所有数据

      let myJcMap = this.getMyJcMap() //获取地图对象

      console.log('网格信息', data)
      if (data && data.length) {
        data.forEach(item => {
          if (item.center) {
            let gridTypeMap = gridAreas[item.areaTypeId] || { icon: item.icon, signs: {}, lnglats: [] }

            gridTypeMap.signs[item.center] = {
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

            gridTypeMap.lnglats.push({ lnglat: item.center.split(','), key: item.center, areaId: item.areaId })

            gridAreas[item.areaTypeId] = gridTypeMap
          }
        })
      }
      console.log('绘制网格-处理之后的数据', gridAreas)
      this.drawGrids() //绘画网格数据
    },
    /**
     * 绘画网格数据
     */
    drawGrids() {
      let mapGridTypes = []

      for (let type in gridAreas) {
        mapGridTypes.push(type)
        let gridTypeMap = gridAreas[type]

        gridTypeMap.markerCluster = this.getGridMarkerCluster(gridTypeMap)
        gridTypeMap.markerCluster.on('click', (context) => {
          this.markerGridClusterClick(gridTypeMap, context)
        })
      }
      this.areaTipVisibles = mapGridTypes
      this.togetherVisibles = mapGridTypes
      this.$EventBus.$emit('map-grid-types-change', mapGridTypes) //通知地图存在类型
      this.fitGrids() //画出网格
    },
    fitGrids() {
      let myJcMap = this.getMyJcMap() //获取地图对象

      for (let type in gridAreas) {
        let gridTypeMap = gridAreas[type]

        //处理聚合是否显示
        if (this.areaTipVisibles.includes(type)) {
          gridTypeMap.markerCluster.setMap(myJcMap.map)

          //处理是否进行聚合
          if (this.togetherVisibles.includes(type)) {
            gridTypeMap.markerCluster.setMaxZoom(18)
          } else {
            gridTypeMap.markerCluster.setMaxZoom(0)
          }
          //处理是否显示标题
          gridTypeMap.markerCluster.setGridSize(120)
        } else {
          gridTypeMap.markerCluster.setMap(null)
        }

        //地图区域显示控制
        let showSign = this.areaAreaVisibles.includes(type)

        for (let key in gridTypeMap.signs) {
          if (showSign) {
            gridTypeMap.signs[key].sign.areaVisible = true
            gridTypeMap.signs[key].sign.setMap(myJcMap)
          } else {
            gridTypeMap.signs[key].sign.setMap(null)
          }
        }
      }
    },
    getGridMarkerCluster(gridTypeMap) {
      return new MarkerCluster(null, gridTypeMap.lnglats, {
        gridSize: 120,
        renderClusterMarker: (context) => {
          this.renderGridClusterMarker(gridTypeMap, context)
        },
        renderMarker: (context) => {
          this.renderGridMarker(gridTypeMap, context)
        }
      })
    },
    renderGridClusterMarker(gridTypeMap, context) {
      console.log('绘制网格-聚合绘制', context)
      context.marker.setAnchor('center')
      context.marker.setContent(`<div class="jc-marker-content jc-marker-cluster" style="background-image: url(${JcIcons[gridTypeMap.icon].cluster});">${context.count}</div>`)
    },
    renderGridMarker(gridTypeMap, context) {
      console.log('绘制网格-单点绘制', context)
      let key = context.data[0].lnglat.lng + ',' + context.data[0].lnglat.lat

      let signItem = gridTypeMap.signs[key]

      let isAbnormal = this.abnormalGridIds.includes(signItem.areaId) //当前岗点是否异常

      let content = `<div class="jc-marker-content" style="background-image: url(${isAbnormal ? JcIcons[signItem.icon].abnormal : JcIcons[signItem.icon].icon});">`

      if (this.areaTipVisibles.includes(signItem.areaTypeId)) {
        content += `<div class="jc-marker-title">${signItem.areaName}</div>`
      }

      context.marker.setAnchor('center')
      context.marker.setContent(content)
    },
    markerGridClusterClick(gridTypeMap, context) {
      console.log('绘制网格-点击', context)
      let myJcMap = this.getMyJcMap() //获取地图对象

      //处理数据，如果是单个则去通知显示详情，是多个的聚合，则定位到显示
      if (context.clusterData.length > 1) {
        myJcMap.map.setBounds(this.getAmapBundles(context.clusterData))
      } else {
        //获取信息去通知显示详情
        let key = context.lnglat.lng + ',' + context.lnglat.lat

        let signItem = gridTypeMap.signs[key]

        this.$EventBus.$emit('view-component-change', { component: 'GridDetail', options: { areaId: signItem.areaId, areaName: signItem.areaName, areaTypeId: signItem.areaTypeId, center: signItem.center, icon: signItem.icon } }) //通知窗口改变
      }
    },
    clearGrids() {
      //清除所有数据
      for (let type in gridAreas) {
        let gridTypeMap = gridAreas[type]

        //清除聚合
        gridTypeMap.markerCluster.setMap(null)
        //清除sign 显示
        for (let key in gridTypeMap.signs) {
          gridTypeMap.signs[key].sign.setMap(null)
        }
      }
      gridAreas = {}
      this.abnormalGridIds = [] //重置岗点异常id数组
    },
    gridLocation(data) {
      //网格定位
      console.log('gridLocation', data)
      //先处理当前数据类型在地图上是否显示，如果不显示，则不处理
      let noGrid = true //处理网格是否存在，不存在则提示

      if (this.areaTipVisibles.includes(data.areaTypeId)) {
        let gridTypeMap = gridAreas[data.areaTypeId]

        for (let i = 0; i < gridTypeMap.lnglats.length; i++) {
          if (gridTypeMap.lnglats[i].areaId == data.id) {
            if (this.areaAreaVisibles.includes(data.areaTypeId)) {
              let gridSign = gridTypeMap.signs[gridTypeMap.lnglats[i].key]

              if (gridSign && gridSign.sign) {
                gridSign.sign.fitView()
                noGrid = false //设置网格存在
              }
            } else {
              let myJcMap = this.getMyJcMap() //获取地图对象

              myJcMap.map.setZoomAndCenter(18, gridTypeMap.lnglats[i].key.split(','))
              noGrid = false //设置网格存在
            }
            break
          }
        }
      }
      if (noGrid) {
        this.$message.error('该网格未显示')
      }
    },
    gridShowAreaChange(areas) {
      //组织区域显示
      this.areaAreaVisibles = [...areas]
      this.fitGrids()
    },
    gridShowWordChange(words) {
      //组织文字显示
      this.areaTipVisibles = [...words]

      this.fitGrids()
    },
    gridTogetherChange(togethers) {
      //聚合显示控制
      this.togetherVisibles = [...togethers]
      this.fitGrids()
    }
  },
  beforeDestroy() {
    this.clearGrids() //清除基础数据
    //去除事件监听
    this.$EventBus.$off('org-change', this.areaMap)
    this.$EventBus.$off('map-grid-change', this.mapGridChange)
    this.$EventBus.$off('screen-grid-location', this.gridLocation)
    this.$EventBus.$off('show-area-change', this.gridShowAreaChange)
    this.$EventBus.$off('show-word-change', this.gridShowWordChange)
    this.$EventBus.$off('show-together-change', this.gridTogetherChange)
  }
}
