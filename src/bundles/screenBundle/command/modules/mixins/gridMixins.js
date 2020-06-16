/**
 * 地图网格处理
 */
import { areaList } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { JcMapSign } from '@/map'
import { PROJECT_TYPES } from '@/constant/Dictionaries'
import { getElasticMarker } from '@/map/aMap/aMapUtil'

let gridData = {} //存储已经请求的组织数据

let gridAreas = {} //网格区域数组

let ElasticMarker //存储 ElasticMarker

export default {
  data() {
    return {
      gridOrg: null,
      areaTipVisibles: {}, //网格区域对应类型是否显示名称
      areaAreaVisible: {} //网格区域对应类型是否显示区域
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.areaMap) //监听行级别切换
    this.$EventBus.$on('show-area-change', this.gridShowAreaChange) //监听区域显示切换
    this.$EventBus.$on('show-word-change', this.gridShowWordChange) //监听文字显示切换
  },
  methods: {
    async areaMap(org) {
      ElasticMarker = await getElasticMarker() //获取 ElasticMarker 对象
      //处理地图
      this.gridOrg = org
      console.log('指挥层级切换变化', org)
      try {
        let res = gridData[this.gridOrg.orgId]

        if (!(res && res.length)) {
          res = await areaList({ orgId: this.gridOrg.orgId, projectId: this.project.projectId, orgSearchType: AREAS_TYPE.OWN_AND_CHILD, searchType: AREAS_SEARCH_TYPE.GRID })

          gridData[this.gridOrg.orgId] = res
        }

        this.drawGrids(res)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 绘制网格信息
     * @param {Array} data 组织区域数据
     */
    drawGrids(data) {
      this.clearGrids() //清除所有数据
      console.log('网格信息', data)
      if (data && data.length) {
        data.forEach(item => {

        })
      }
      // myJcMap.fitView()
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
