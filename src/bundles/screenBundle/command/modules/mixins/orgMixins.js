/**
 * 地图组织处理
 */
import { areaList } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE, MAP_EVENT } from '@/constant/CONST'
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { JcMapSign } from '@/map'
import { PROJECT_TYPES } from '@/constant/Dictionaries'

let orgData = {} //存储已经请求的组织数据

let orgAreas = [] //组织区域数组

export default {
  data() {
    return {
      org: null,
      zoomOrgs: {},
      nowOrgId: null,
      orgTipVisible: false, //组织是否显示名称
      orgAreaVisible: true //组织是否显示区域
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.orgMap) //监听行级别切换
    this.$EventBus.$on('show-area-change', this.orgShowAreaChange) //监听区域显示切换
    this.$EventBus.$on('show-word-change', this.orgShowWordChange) //监听文字显示切换
  },
  methods: {
    orgMap(org) {
      //处理地图
      this.org = org
      console.log('指挥层级切换变化', org)
      this.orgChangeMap(this.org.orgId)
    },
    async orgChangeMap(orgId) {
      try {
        let res = orgData[orgId]

        if (!(res && res.length)) {
          if (PROJECT_TYPES.EmergencySupport == this.project.projectType) {
            res = await areaList({ orgId, orgSearchType: AREAS_TYPE.OWN, searchType: AREAS_SEARCH_TYPE.ORG })
          } else {
            res = await areaList({ orgId, orgSearchType: AREAS_TYPE.OWN_AND_CHILD, searchType: AREAS_SEARCH_TYPE.ORG })
          }

          orgData[orgId] = res
        }

        if (this.zoomOrgs[orgId]) {
          this.zoomOrgs[orgId].zoom = null
        } else {
          this.zoomOrgs[orgId] = { pid: orgId == this.org.orgId ? null : this.nowOrgId, orgId }//设置层级属性
        }
        this.nowOrgId = orgId

        this.drawOrgSign(res)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 绘画组织区域信息
     * @param {Array} data 组织区域数据
     */
    drawOrgSign(data) {
      let myJcMap = this.getMyJcMap() //获取地图对象

      myJcMap.map.setStatus({ scrollWheel: false }) //设置禁止滚轮缩放

      myJcMap.removeSign(orgAreas) //清除之前的区域显示

      this.addMapZoomListener(myJcMap) //添加地图缩放监听

      let areas = []

      if (data && data.length) {
        data.forEach(item => {
          if (item.orgId == this.org.orgId) {
            //如果相同的组织信息，则通知组织adcode
            this.$EventBus.$emit('org-adcode-change', { areaId: item.areaId, areaCode: item.areaCode, areaTypeName: item.areaTypeName })
          }
          //如果绘图时子集不存在，则绘图自己的边界
          if (item.orgId != this.nowOrgId || data.length == 1) {
            let mapSign = new JcMapSign({
              id: item.orgId,
              map: myJcMap,
              name: item.areaName,
              center: item.center.split(','),
              tipVisible: this.orgTipVisible,
              areaVisible: this.orgAreaVisible,
              extData: { orgId: item.orgId, adcode: item.areaCode, areaId: item.areaId, areaName: item.areaName },
              boundaries: apiBoundariesFormat(item)
            })

            areas.push(mapSign)
          }
        })
      }
      orgAreas = areas

      myJcMap.addSign(orgAreas)
      myJcMap.fitView(orgAreas)
      orgAreas.forEach(item => {
        this.addListener(item) //添加监听
      })

      //设置定时恢复，避免因为层级没有变动导致滚轮缩放无法恢复
      setTimeout(() => {
        myJcMap.map.setStatus({ scrollWheel: true }) //设置启用滚轮缩放
      }, 3000)
    },
    addMapZoomListener(myJcMap) {
      myJcMap.off(MAP_EVENT.ZOOMEND)
      myJcMap.on(MAP_EVENT.ZOOMEND, () => {
        let item = this.zoomOrgs[this.nowOrgId]

        let zoom = myJcMap.map.getZoom()

        if (item.zoom) {
          if (item.zoom > zoom && item.pid) {
            this.orgChangeMap(item.pid)
          }
        } else {
          item.zoom = zoom
          myJcMap.map.setStatus({ scrollWheel: true }) //设置启用滚轮缩放
        }
        console.log(zoom)
      })
    },
    addListener(mapSign) {
      //增加鼠标事件
      mapSign.off(MAP_EVENT.MOURSEOVER)
      mapSign.on(MAP_EVENT.MOURSEOVER, () => {
        mapSign.map.map.setStatus({ doubleClickZoom: false }) //设置禁止双击缩放
        mapSign.signActive(true)
      })
      mapSign.off(MAP_EVENT.MOURSEOUT)
      mapSign.on(MAP_EVENT.MOURSEOUT, () => {
        mapSign.map.map.setStatus({ doubleClickZoom: true }) //设置禁止双击缩放
        mapSign.signActive(false)
      })
      mapSign.off(MAP_EVENT.DBCLICK)
      mapSign.on(MAP_EVENT.DBCLICK, () => {
        if (mapSign.extData.orgId != this.nowOrgId) {
          this.orgChangeMap(mapSign.extData.orgId)
        }
      })
    },
    orgShowAreaChange(areas) {
      this.orgAreaVisible = areas.indexOf('org') > -1 //如果存在组织区域显示，则显示区域，否则不显示
      orgAreas.forEach(item => {
        item.showArea(this.orgAreaVisible)
      })
    },
    orgShowWordChange(words) {
      this.orgTipVisible = words.indexOf('org') > -1 //如果存在组织区域显示，则显示文字，否则不显示
      orgAreas.forEach(item => {
        item.showTip(this.orgTipVisible)
      })
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('org-change', this.orgMap)
    this.$EventBus.$off('show-area-change', this.orgShowAreaChange)
    this.$EventBus.$off('show-word-change', this.orgShowWordChange)
  }
}
