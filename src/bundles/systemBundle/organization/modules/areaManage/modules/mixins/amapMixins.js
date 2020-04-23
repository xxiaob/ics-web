/**
 * 地图相关处理
 */
import { PolygonStyle } from '@/config/JcMapConfig'
import { apiBoundariesFormat } from '@/libs/apiFormat'

let usePolygons = {}

let JcMapUtils //用于存储工具类

let orgPolygons = { base: [], edit: [] }

export default {
  methods: {
    getAdcodeArea() {
      //根据adcode 获取区域数据
    },
    drawPolygon(data, util) {
      JcMapUtils = util
      JcMapUtils.polygon.clear(this.getAllPolygons()) //清除之前的显示
      usePolygons = {}
      if (data && data.length) {
        let orgs = {}

        data.forEach(item => {
          if (item.orgId == this.orgId) {
            this.adcode = item.adcode || ''
          }
          orgs[item.orgId] = {
            data: { orgId: item.orgId, adcode: item.areaCode, areaId: item.areaId, areaName: item.areaName },
            path: apiBoundariesFormat(item.withoutRadiusReqs).path
          }
        })
        let firstOrgId = data[0].orgId

        JcMapUtils.polygon.add({ ...PolygonStyle.base, extData: orgs[firstOrgId].data, path: orgs[firstOrgId].path }, (polygons) => {
          usePolygons[firstOrgId] = polygons
          for (let key in orgs) {
            if (key != firstOrgId) {
              this.addPolygon(orgs[key])
            }
          }

          //处理当前组织
          orgPolygons.base = usePolygons[this.orgId] || []

          if (orgPolygons.base && orgPolygons.base.length) {
            orgPolygons.base.forEach(polygon => {
              polygon.setOptions(PolygonStyle.active)
            })
          }
          JcMapUtils.map.add(this.getAllPolygons()) //添加到map
          JcMapUtils.map.setFitView()//地图自适应
        })
      }
    },
    addPolygon(item) {
      if (orgPolygons.base && orgPolygons.base.length) {
        JcMapUtils.polygon.clear(orgPolygons.base)
      }
      JcMapUtils.polygon.add({ ...PolygonStyle.base, ...PolygonStyle.active, extData: item.data, path: item.path }, (polygons) => {
        usePolygons[item.data.orgId] = polygons
      })
    },
    getAllPolygons() {
      let polygons = []

      for (let key in usePolygons) {
        polygons.push(...usePolygons[key])
      }
      return polygons
    }
  }
}
