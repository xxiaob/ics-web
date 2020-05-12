/**
 * 网格变化处理
 */
import { areaList, areaGet } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { JcMapSign } from '@/map'

let areas = {} //存储已经绘画的区域

export default {
  methods: {
    async viewControl(myJcMap, options) {
      let areaSign = areas[options.data.id]

      if (options.data.view) {
        if (areaSign) {
          areaSign.hide()
        }
        options.data.view = false
        return true
      }

      if (areaSign) {
        areaSign.show()
        options.data.view = true
        return true
      }

      if (options.data.areaId) {
        //获取区域
        const res = await areaGet({ areaId: options.data.areaId })
      } else {
        const res = await areaList({ orgId: options.data.orgId, orgSearchType: AREAS_TYPE.OWN, searchType: AREAS_SEARCH_TYPE.ORG })

        if (res && res.length) {
          let item = res[0]

          areaSign = new JcMapSign({
            id: item.areaId,
            map: myJcMap,
            name: item.areaName,
            center: item.center ? item.center.split(',') : null,
            extData: {},
            boundaries: apiBoundariesFormat(item)
          })
          areas[options.data.id] = areaSign
          options.data.view = true
          areaSign.show()
        }
      }
    }
  }
}
