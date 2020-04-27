/**
 * 自动区域处理
 */
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { getUsableAdCodeList, areaGet } from '@/api/area'
import JcMapSign from '@/maps/JcMapSign'

let allAreaPolygons = {}

let myJcMap //承载JcMap对象

export default {
  data() {
    return {
      autoAreas: [],
      adcode: '',
      editadcode: ''
    }
  },
  methods: {
    initAutoArea(mapUtil) {
      myJcMap = mapUtil
      this.editadcode = this.adcode
      if (this.autoAreas.length < 1) {
        //去获取adcode 列表
        getUsableAdCodeList().then(res => {
          this.autoAreas = this.formatAreas(res)
        })
      }
      this.endCustomArea()
      if (!this.adcode) {
        this.hideActiveSign()
      }
    },
    formatAreas(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = {
            value: item.adcode,
            label: item.name
          }

          let children = this.formatAreas(item.adcodes)

          if (children && children.length) {
            node.children = children
          }

          trees.push(node)
        })
      }
      return trees
    },
    adCodeChange(adcode) {
      this.startEdit = true
      let sign = allAreaPolygons[adcode]

      if (sign) {
        this.hideActiveSign()
        if (this.editAreas.length) {
          this.editAreas[0].hide()
        }
        sign.show()
        this.editAreas[0] = sign
        myJcMap.fitView()
        console.log(adcode)
      } else {
        areaGet({ adcode }).then(res => {
          allAreaPolygons[adcode] = new JcMapSign({
            id: this.orgId,
            map: myJcMap.map,
            extData: { orgId: this.orgId, adcode: adcode, areaId: res.areaId, areaName: res.areaName },
            boundaries: apiBoundariesFormat(res),
            active: true
          })
          this.adCodeChange(adcode)
        })
      }
    },
    endAutoArea() {
      if (this.editAreas.length) {
        this.editAreas[0].hide()
        this.editAreas = []
      }
    }
  }
}
