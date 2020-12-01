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
      isFirstLoad: true, //是否首次加载
      orgSignVisible: false, //是否显示中心点标记
      orgTipVisible: false, //组织是否显示名称
      orgAreaVisible: false //组织是否显示区域
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.orgMap) //监听行级别切换
    this.$EventBus.$on('screen-org-location', this.orgLocation) //监听组织定位
    this.$EventBus.$on('show-sign-change', this.orgShowSignChange) //过滤信息显示
  },
  methods: {
    orgMap(org) {
      //处理地图
      this.org = org
      console.log('指挥层级切换变化', org)
      this.orgChangeMap(this.org.orgId)

      //添加地图缩放监听
      let myJcMap = this.getMyJcMap() //获取地图对象

      myJcMap.off(MAP_EVENT.ZOOMEND, this.mapZoom)
      myJcMap.on(MAP_EVENT.ZOOMEND, this.mapZoom)
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

        //处理层级切换问题
        if (this.zoomOrgs[orgId]) {
          this.zoomOrgs[orgId].zoom = null
          if (orgId == this.org.orgId) {
            this.zoomOrgs[orgId].pid = null
          }
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

      let areas = []

      if (data && data.length) {
        data.forEach(item => {
          //如果绘图时子集不存在，则绘图自己的边界
          if (item.orgId != this.nowOrgId || data.length == 1) {
            let mapSign = new JcMapSign({
              id: item.orgId,
              map: myJcMap,
              name: item.areaName,
              center: item.center.split(','),
              signVisible: this.orgSignVisible,
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
        this.addMapSignListener(item) //添加监听
      })

      //设置定时恢复，避免因为层级没有变动导致滚轮缩放无法恢复
      setTimeout(() => {
        myJcMap.map.setStatus({ scrollWheel: true }) //设置启用滚轮缩放
      }, 3000)
    },
    mapZoom() {
      //地图缩放处理
      let item = this.zoomOrgs[this.nowOrgId]

      if (!item) {
        return
      }

      let myJcMap = this.getMyJcMap() //获取地图对象

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
    },
    addMapSignListener(mapSign) {
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
    orgLocation(data) {
      console.log('orgLocation', data, this.nowOrgId)
      if (!this.orgAreaVisible) {
        this.$message.error('组织结构区域未显示')
        return
      }
      //组织定位
      if (this.nowOrgId == data.id) {
        let myJcMap = this.getMyJcMap() //获取地图对象

        myJcMap.fitView(orgAreas)
        return
      }
      let noOrg = true //处理组织是否存在，不存在则提示

      for (let i = 0; i < orgAreas.length; i++) {
        let item = orgAreas[i]

        if (item.extData.orgId == data.id) {
          item.fitView()
          noOrg = false
          break
        }
      }
      if (noOrg) {
        this.$message.error('组织结构未显示')
      }
    },
    orgShowAreaChange(areas) {
      let orgAreaVisible = areas.includes('org') //如果存在组织区域显示，则显示区域，否则不显示

      if (this.orgAreaVisible == orgAreaVisible) {
        return
      }
      this.orgAreaVisible = orgAreaVisible
      orgAreas.forEach(item => {
        item.showArea(this.orgAreaVisible)
      })
    },
    orgShowWordChange(words) {
      let orgTipVisible = words.includes('org')

      if (this.orgTipVisible == orgTipVisible) {
        return
      }
      this.orgTipVisible = orgTipVisible
      orgAreas.forEach(item => {
        item.tipVisible = this.orgTipVisible
        item.showTip()
      })
    },
    orgShowSignChange(data) {
      let needUpdate = false

      //处理区域显示
      let orgAreaVisible = data.areas.includes('org') //如果存在组织区域显示，则显示区域，否则不显示

      if (this.orgAreaVisible != orgAreaVisible) {
        this.orgAreaVisible = orgAreaVisible
        needUpdate = true
      }

      //处理标题显示
      let orgTipVisible = data.words.includes('org')

      if (this.orgTipVisible != orgTipVisible) {
        this.orgTipVisible = orgTipVisible
        needUpdate = true
      }

      //处理实体显示
      let orgSignVisible = data.signs.includes('org')

      if (this.orgSignVisible != orgSignVisible) {
        this.orgSignVisible = orgSignVisible
        needUpdate = true
      }

      if (needUpdate) {
        orgAreas.forEach(item => {
          item.areaVisible = this.orgAreaVisible
          item.tipVisible = this.orgTipVisible
          item.signVisible = this.orgSignVisible
          item.show()
          this.addMapSignListener(item) //添加监听
        })
        if (this.isFirstLoad) {
          this.isFirstLoad = false
          let myJcMap = this.getMyJcMap() //获取地图对象

          myJcMap.fitView(orgAreas)
        }
      }
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('org-change', this.orgMap)
    this.$EventBus.$off('show-sign-change', this.orgShowSignChange)
  }
}
