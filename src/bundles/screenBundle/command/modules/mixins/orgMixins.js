/**
 * 地图组织处理
 */
import { areaList } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { JcMapSign } from '@/map'

let orgAreas = [] //组织区域数组

export default {
  data() {
    return {
      org: null
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.orgMap) //使用事件总线进行级别切换通知
  },
  methods: {
    async orgMap(org) {
      //处理地图
      this.org = org
      console.log('指挥层级切换变化', org)
      try {
        let res = await areaList({ orgId: this.orgId, orgSearchType: AREAS_TYPE.SAMELEVEL, searchType: AREAS_SEARCH_TYPE.ORG })
      } catch (error) {
        console.log(error)
      }
    },
    drawSign(data) {
      let myJcMap = this.getMyJcMap() //获取地图对象

      myJcMap.clearSign() //清除之前的显示

      let areas = []

      if (data && data.length) {
        data.forEach(item => {
          areas.push(new JcMapSign({
            id: item.orgId,
            map: myJcMap,
            name: item.areaName,
            center: item.center.split(','),
            extData: { orgId: item.orgId, adcode: item.areaCode, areaId: item.areaId, areaName: item.areaName },
            boundaries: apiBoundariesFormat(item)
          }))
        })
      }
      orgAreas = areas

      myJcMap.addSign(orgAreas)
      myJcMap.fitView()
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('org-change', this.orgMap)
  }
}
