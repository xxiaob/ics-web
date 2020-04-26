/**
 * 自动区域处理
 */
import { PolygonStyle } from '@/config/JcMapConfig'
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { areaGet } from '@/api/area'

let JcMapUtils //用于存储工具类

let allAreaPolygons = {}

export default {
  data() {
    return {
      autoAreas: [],
      adcode: '',
      editadcode: ''
    }
  },
  methods: {
    initAutoArea(util) {
      JcMapUtils = util
      this.editadcode = this.adcode
      if (this.autoAreas.length < 1) {
        //去获取adcode 列表
      }

      //去处理显示
      let ownPolygons = this.getOwnPolygons()

      if (ownPolygons && ownPolygons.length) {
        ownPolygons.forEach(item => {
          let data = item.getExtData()

          if (data.adcode) {
            item.setMap(JcMapUtils.map)
          } else {
            item.setMap(null)
          }
        })
      }
    },
    adCodeChange(adcode) {
      let polygons = allAreaPolygons[adcode]

      if (polygons) {
        this.changePolygons(polygons)
      } else {
        areaGet({ adcode }).then(res => {
          JcMapUtils.polygon.add({
            ...PolygonStyle.base, ...PolygonStyle.active, extData: {
              adcode: res.areaCode, areaId: res.areaId, areaName: res.areaName
            }, path: apiBoundariesFormat(res.withoutRadiusReqs).path
          }, (newPolygons) => {
            allAreaPolygons[adcode] = newPolygons
            this.changePolygons(newPolygons)
          })
        })
      }
      console.log(adcode)
    }
  }
}
