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
    async orgMap(org) {
      //处理地图
      this.org = org
      console.log('指挥层级切换变化', org)
      try {
        let res = orgData[this.org.orgId]

        if (!(res && res.length)) {
          if (PROJECT_TYPES.EmergencySupport == this.project.projectType) {
            res = await areaList({ orgId: this.org.orgId, orgSearchType: AREAS_TYPE.OWN, searchType: AREAS_SEARCH_TYPE.ORG })
          } else {
            res = await areaList({ orgId: this.org.orgId, orgSearchType: AREAS_TYPE.OWN_AND_CHILD, searchType: AREAS_SEARCH_TYPE.ORG })
          }

          orgData[this.org.orgId] = res
        }

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

      myJcMap.removeSign(orgAreas) //清除之前的区域显示

      let areas = []

      if (data && data.length) {
        data.forEach(item => {
          if (item.orgId == this.org.orgId) {
            this.$EventBus.$emit('org-adcode-change', { areaId: item.areaId, areaCode: item.areaCode, areaTypeName: item.areaTypeName })
          }
          if (item.orgId != this.org.orgId || data.length == 1) {
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

            this.addListener(mapSign) //添加监听
            areas.push(mapSign)
          }
        })
      }
      orgAreas = areas

      myJcMap.addSign(orgAreas)
      myJcMap.fitView()
    },
    addListener(mapSign) {
      //增加鼠标事件
      mapSign.on(MAP_EVENT.MOURSEOVER, () => {
        mapSign.signActive(true)
      })
      mapSign.on(MAP_EVENT.MOURSEOUT, () => {
        mapSign.signActive(false)
      })
    },
    orgShowAreaChange(areas) {
      //组织区域显示
      if ((areas || areas.length).filter(id => id == 'org').length) {
        this.orgAreaVisible = true //如果存在组织区域显示，则显示区域
      } else {
        this.orgAreaVisible = false //不存在则显示
      }
      orgAreas.forEach(item => {
        item.showArea(this.orgAreaVisible)
      })
    },
    orgShowWordChange(words) {
      //组织文字显示
      if ((words || words.length).filter(id => id == 'org').length) {
        //如果存在组织区域显示，则显示文字
        this.orgTipVisible = true
      } else {
        //不存在则显示
        this.orgTipVisible = false
      }
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
