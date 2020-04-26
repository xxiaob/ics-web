/**
 * 地图相关处理
 */
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { areaUpdate } from '@/api/area'
import JcMapSign from '@/maps/JcMapSign'

export default {
  methods: {
    drawPolygon(data, myJcMap) {
      myJcMap.cleargSign(this.getAllPolygons()) //清除之前的显示

      let areas = []

      if (data && data.length) {
        data.forEach(item => {
          if (item.orgId == this.orgId) {
            this.adcode = item.areaCode || ''
            this.areaId = item.areaId
          }
          areas.push(new JcMapSign({
            id: item.orgId,
            extData: { orgId: item.orgId, adcode: item.areaCode, areaId: item.areaId, areaName: item.areaName },
            boundaries: apiBoundariesFormat(item),
            active: item.orgId == this.orgId ? true : false
          }))
        })
        // let firstOrgId = data[0].orgId

        // JcMapUtils.polygon.add({ ...PolygonStyle.base, extData: orgs[firstOrgId].data, path: orgs[firstOrgId].path }, (polygons) => {
        //   usePolygons[firstOrgId] = polygons
        //   for (let key in orgs) {
        //     if (key != firstOrgId) {
        //       this.addPolygon(orgs[key])
        //     }
        //   }

        //   //处理当前组织
        //   orgPolygons.base = usePolygons[this.orgId] || []

        //   if (orgPolygons.base && orgPolygons.base.length) {
        //     orgPolygons.base.forEach(polygon => {
        //       polygon.setOptions(PolygonStyle.active)
        //     })
        //   }
        //   JcMapUtils.map.add(this.getAllPolygons()) //添加到map
        //   JcMapUtils.map.setFitView()//地图自适应
        // })
      }
      this.areas = areas
      myJcMap.paintingSign(this.areas)
    },
    reset() {
      //重置数据
      if (this.startEdit) {
        this.$confirm('您正在编辑中，确认取消编辑', '提示', { type: 'warning' }).then(() => {
          // this.clearEditPolygons()
          this.reset()
        }).catch(() => { })
      } else {
        // JcMapUtils.map.add(orgPolygons.base) //添加到map
        // JcMapUtils.map.setFitView()//地图自适应
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
        this.$message.error('您未更改数据')
      }
    }
  }
}
