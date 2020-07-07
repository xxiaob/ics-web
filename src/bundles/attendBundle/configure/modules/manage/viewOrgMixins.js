/**
 * 网格变化处理
 */
import { areaList } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { JcMapSign } from '@/map'

let areas = {} //存储已经绘画的区域

export default {
  created() {
    areas = {}
  },
  methods: {
    async viewControl(myJcMap, orgId) {
      if (myJcMap) {
        console.log('myJcMap areas', myJcMap, areas)
      }
      Object.keys(areas).forEach(key => {
        areas[key].hide()
      })
      let areaSign = areas[orgId]

      if (areaSign) {
        areaSign.show()
        return true
      }

      let item = null
      const res = await areaList({ orgId: orgId, orgSearchType: AREAS_TYPE.OWN, searchType: AREAS_SEARCH_TYPE.ORG })

      if (res && res.length) {
        item = res[0]
      }
      if (item) {
        areaSign = new JcMapSign({
          id: orgId,
          map: myJcMap,
          icon: item.icon,
          name: item.areaName,
          center: item.center ? item.center.split(',') : null,
          extData: {},
          boundaries: apiBoundariesFormat(item)
        })
        areaSign.show()
        areas[orgId] = areaSign
      }
    }
  }
}
