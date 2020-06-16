/**
 * 地图网格处理
 */
import { areaList } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { JcMapSign } from '@/map'
import { getMarkerCluster } from '@/map/aMap/aMapUtil'
import { JcIcons } from '@/config/JcIconConfig'

let gridData = {} //存储已经请求的组织数据

let gridAreas = {} //网格区域数组，例如数据： {'caichang': {markerCluster: MarkerCluster, signs: {'59242618223067136': {}}}}

let MarkerCluster //存储 MarkerCluster

export default {
  data() {
    return {
      gridOrg: null,
      areaTipVisible: true, //默认值
      areaAreaVisible: false, //默认值
      areaTipVisibles: {}, //网格区域对应类型是否显示名称
      areaAreaVisibles: {} //网格区域对应类型是否显示区域
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.areaMap) //监听行级别切换
    this.$EventBus.$on('show-area-change', this.gridShowAreaChange) //监听区域显示切换
    this.$EventBus.$on('show-word-change', this.gridShowWordChange) //监听文字显示切换
  },
  methods: {
    async areaMap(org) {
      MarkerCluster = await getMarkerCluster() //获取 MarkerCluster 对象
      //处理地图
      this.gridOrg = org
      console.log('指挥层级切换变化', org)
      try {
        let res = gridData[this.gridOrg.orgId]

        if (!(res && res.length)) {
          res = await areaList({ orgId: this.gridOrg.orgId, projectId: this.project.projectId, orgSearchType: AREAS_TYPE.OWN_AND_CHILD, searchType: AREAS_SEARCH_TYPE.GRID })

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
          let gridTypeMap = gridAreas[item.areaTypeId] || { icon: item.icon, signs: {}, lnglats: [] }

          gridTypeMap.signs[item.areaId] = {
            areaId: item.areaId, areaName: item.areaName, center: item.center, icon: item.icon, sign: new JcMapSign({
              id: item.orgId,
              map: myJcMap,
              name: item.areaName,
              center: item.center.split(','),
              tipVisible: false,
              areaVisible: false,
              boundaries: apiBoundariesFormat(item)
            })
          }

          gridTypeMap.lnglats.push({ lnglat: item.center.split(',') })

          gridAreas[item.areaTypeId] = gridTypeMap
        })
      }
      console.log('绘制网格-处理之后的数据', gridAreas)
      this.drawGrids() //绘画网格数据
    },
    /**
     * 绘画网格数据
     */
    drawGrids() {
      let myJcMap = this.getMyJcMap() //获取地图对象

      let mapGridTypes = []

      for (let type in gridAreas) {
        mapGridTypes.push(type)
        let gridTypeMap = gridAreas[type]

        gridTypeMap.markerCluster = new MarkerCluster(myJcMap.map, gridTypeMap.lnglats, {
          gridSize: 120,
          renderClusterMarker: this.renderClusterMarker,
          renderMarker: this.renderMarker
        })
        gridTypeMap.markerCluster.on('click', this.markerClusterClick)
      }
      this.$EventBus.$emit('map-grid-types-change', mapGridTypes) //通知地图存在类型
    },
    renderClusterMarker(context) {
      console.log('绘制网格-聚合绘制', context)
      return 'aaa'
    },
    renderMarker(context) {
      console.log('绘制网格-单点绘制', context)
      return 'bbb'
    },
    markerClusterClick(data) {
      console.log('绘制网格-点击', data)
    },
    clearGrids() {
      //清除所有数据
    },
    gridShowAreaChange(areas) {
      //组织区域显示
      if ((areas || areas.length).filter(id => id == 'org').length) {
        //如果存在组织区域显示，则显示区域
        this.orgAreaVisible = true
      } else {
        //不存在则显示
        this.orgAreaVisible = false
      }
      // orgAreas.forEach(item => {
      //   item.showArea(this.orgAreaVisible)
      // })
    },
    gridShowWordChange(words) {
      //组织文字显示
      // if ((words || words.length).filter(id => id == 'org').length) {
      //   //如果存在组织区域显示，则显示文字
      //   this.orgTipVisible = true
      // } else {
      //   //不存在则显示
      //   this.orgTipVisible = false
      // }
      // orgAreas.forEach(item => {
      //   item.showTip(this.orgTipVisible)
      // })
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('org-change', this.orgMap)
    this.$EventBus.$off('show-area-change', this.orgShowAreaChange)
    this.$EventBus.$off('show-word-change', this.orgShowWordChange)
  }
}
