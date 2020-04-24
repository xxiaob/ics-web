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
      autoAreas: []
    }
  },
  methods: {
    initAutoArea(util) {
      JcMapUtils = util
      this.editadcode = this.adcode
      if (this.autoAreas.length < 1) {
        JcMapUtils.districtSearch({ keyword: '320100', options: { level: 'city' } }, (result) => {
          let areas = result.districtList[0].districtList

          let list = []

          if (areas && areas.length) {
            areas.forEach(item => {
              list.push({ adcode: item.adcode, name: item.name, level: item.level })
            })
          }
          this.autoAreas = list
          console.log(areas, list)
        })
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
