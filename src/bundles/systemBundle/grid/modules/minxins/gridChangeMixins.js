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

      let item = null

      if (options.data.areaId) {
        item = await areaGet({ areaId: options.data.areaId })//获取区域
      } else {
        const res = await areaList({ orgId: options.data.orgId, orgSearchType: AREAS_TYPE.OWN, searchType: AREAS_SEARCH_TYPE.ORG })

        if (res && res.length) {
          item = res[0]
        }
      }
      if (item) {
        areaSign = new JcMapSign({
          id: options.data.id,
          map: myJcMap,
          icon: item.icon,
          name: item.areaName,
          center: item.center ? item.center.split(',') : null,
          extData: {},
          boundaries: apiBoundariesFormat(item)
        })
        areaSign.show()
        areas[options.data.id] = areaSign
      }
      options.data.view = true
    },
    refreshSign(myJcMap, areaId) {
      //刷新标记
      this.getSign(myJcMap, areaId, true).then(sign => {
        sign.show()
        myJcMap.fitView()
      })
    },
    fitView(id) {
      let areaSign = areas[id]

      if (areaSign) {
        areaSign.fitView()
      }
    },
    deleteSign(data) {
      let areaSign = areas[data.id]

      if (areaSign) {
        areaSign.hide()
        delete areas[data.id]
      }
    },
    async getSign(myJcMap, areaId, renew = false) {
      let areaSign = areas[areaId]

      if (areaSign) {
        if (renew) {
          areaSign.hide()
        } else {
          return areaSign
        }
      }
      let item = await areaGet({ areaId })//获取区域

      areaSign = new JcMapSign({
        id: areaId,
        map: myJcMap,
        icon: item.icon,
        name: item.areaName,
        center: item.center ? item.center.split(',') : null,
        extData: {},
        boundaries: apiBoundariesFormat(item)
      })
      areas[areaId] = areaSign
      console.log('网格详情：', areaSign)

      return areaSign
    }
  }
}
