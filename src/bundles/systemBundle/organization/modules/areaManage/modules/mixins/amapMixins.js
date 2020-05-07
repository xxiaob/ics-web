/**
 * 地图相关处理
 */
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { areaSave } from '@/api/area'
import { JcMapSign } from '@/map'

let myJcMap //承载JcMap对象

export default {
  methods: {
    drawSign(data, mapUtil) {
      myJcMap = mapUtil
      myJcMap.clearSign() //清除之前的显示

      let areas = []

      if (data && data.length) {
        data.forEach(item => {
          if (item.orgId == this.orgId) {
            this.adcode = item.areaCode || ''
            this.areaId = item.areaId
          }
          areas.push(new JcMapSign({
            id: item.orgId,
            map: myJcMap,
            name: item.areaName,
            center: item.center.split(','),
            extData: { orgId: item.orgId, adcode: item.areaCode, areaId: item.areaId, areaName: item.areaName },
            boundaries: apiBoundariesFormat(item),
            active: item.orgId == this.orgId ? true : false
          }))
        })
      }
      this.areas = areas

      myJcMap.addSign(this.areas)
      myJcMap.fitView()
    },
    reset(cb) {
      //重置数据
      if (this.startEdit) {
        this.$confirm('您正在编辑中，确认取消编辑', '提示', { type: 'warning' }).then(() => {
          this.startEdit = false
          cb()
        }).catch(() => { })
      } else {
        cb()
      }
    },
    getActiveSign() {
      let sign = null

      if (this.areaId) {
        for (let i = 0; i < this.areas.length; i++) {
          let item = this.areas[i]

          if (item.id == this.orgId) {
            sign = item
            break
          }
        }
      }
      return sign
    },
    showActiveSign() {
      let sign = this.getActiveSign()

      if (sign) {
        sign.show()
      }
    },
    hideActiveSign() {
      let sign = this.getActiveSign()

      if (sign) {
        sign.hide()
      }
    },
    manage() {
      if (this.startEdit) {
        this.$confirm('确认保存当前设置', '提示', { type: 'warning' }).then(() => {
          let params = { orgId: this.orgId, areaId: this.areaId }

          if (this.type == 1) {
            //快捷绑定
            params.adcode = this.editadcode
            params.drawCoordinateType = 2
          } else if (this.type == 2) {
            //自定义设置
            Object.assign(params, this.getData())
            params.drawCoordinateType = 1
          }
          areaSave(params).then(() => {
            this.startEdit = false
            this.changeWork(() => {
              this.nodeChange({ orgId: this.orgId })
            })
          })
        }).catch(() => { })
      } else {
        this.$message.error('您未更改数据')
      }
    }
  }
}
