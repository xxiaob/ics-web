/**
 * 地图相关处理
 */
import { PolygonStyle } from '@/config/JcMapConfig'
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { areaUpdate } from '@/api/area'

let usePolygons = {}

let JcMapUtils //用于存储工具类

let orgPolygons

export default {
  methods: {
    drawPolygon(data, util) {
      JcMapUtils = util
      orgPolygons = { base: [], edit: [] }
      JcMapUtils.polygon.clear(this.getAllPolygons()) //清除之前的显示
      usePolygons = {}
      if (data && data.length) {
        let orgs = {}

        data.forEach(item => {
          if (item.orgId == this.orgId) {
            this.adcode = item.areaCode || ''
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
    },
    getOwnPolygons() {
      return orgPolygons.base
    },
    getEditPolygons() {
      return orgPolygons.edit
    },
    changePolygons(polygons) {
      JcMapUtils.polygon.clear(orgPolygons.base)
      JcMapUtils.polygon.clear(orgPolygons.edit)
      orgPolygons.edit = polygons
      JcMapUtils.map.add(orgPolygons.edit) //添加到map
      JcMapUtils.map.setFitView()//地图自适应
    },
    clearEditPolygons() {
      JcMapUtils.polygon.clear(orgPolygons.edit)
      orgPolygons.edit = []
    },
    checkEdit() {
      return orgPolygons.edit && orgPolygons.edit.length
    },
    reset() {
      //重置数据
      if (this.checkEdit()) {
        this.$confirm('您有新的编辑数据，确认重置', '提示', { type: 'warning' }).then(() => {
          this.clearEditPolygons()
          this.reset()
        }).catch(() => { })
      } else {
        JcMapUtils.map.add(orgPolygons.base) //添加到map
        JcMapUtils.map.setFitView()//地图自适应
      }
    },
    manage() {
      if (this.checkEdit()) {
        this.$confirm('确认保存当前设置', '提示', { type: 'warning' }).then(() => {
          let params = { orgId: this.orgId }

          if (this.type == 1) {
            //自定义
            params.adcode = this.editadcode
          }
          areaUpdate(params).then(() => {
            this.nodeChange({ orgId: this.orgId })
          })
        }).catch(() => { })
      } else {
        this.$message.error('您未进行操作')
      }
    }
  }
}
