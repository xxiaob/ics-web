/**自动设置区域 */
import { JcMapEditor, JcMapSign } from '@/map'
import { apiBoundariesFormat, signEditDataFormat } from '@/libs/apiFormat'
import { areaList } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'

let myJcMap //承载JcMap对象

let myJcMapEditor //承载编辑体

let parentSign //记录父级标记

export default {
  methods: {
    initCustomArea(mapUtil) {
      myJcMap = mapUtil
      //去处理显示
      this.endAutoArea()

      let sign = this.hideActiveSign()

      let subSigns = []

      for (let i = 0; i < this.areas.length; i++) {
        let item = this.areas[i]

        if (item.id != this.orgId) {
          subSigns.push(item)
        }
      }

      myJcMapEditor = new JcMapEditor({ map: myJcMap, sign: this.adcode ? null : sign, subSigns: subSigns, name: sign ? sign.name : '' })
      myJcMapEditor.on('change', () => {
        this.startEdit = true
      })
      myJcMap.fitView()
    },
    getData() {
      return signEditDataFormat(myJcMapEditor.getData())
    },
    addArea() {
      myJcMapEditor.addArea()
    },
    endCustomArea() {
      if (myJcMapEditor) {
        myJcMapEditor.destroy()
        if (parentSign) {
          myJcMapEditor.removeAdsorbPolygons([parentSign.sign])
          parentSign.sign.hide()
          parentSign = null
        }
        myJcMapEditor = null
      }
    },
    async showParentView() {
      //显示或隐藏父级区域，如果父级id不存在，则结束显示
      if (!this.orgPid) {
        return
      }
      if (!parentSign || parentSign.pid != this.orgPid) {
        //如果父级不存在，则进行查询
        try {
          let res = await areaList({ orgId: this.orgPid, orgSearchType: AREAS_TYPE.OWN, searchType: AREAS_SEARCH_TYPE.ORG })

          let item = res && res.length ? res[0] : null

          parentSign = {
            pid: this.orgPid, sign: item ? new JcMapSign({
              id: item.orgId,
              map: myJcMap,
              name: item.areaName,
              tipVisible: false,
              center: item.center.split(','),
              boundaries: apiBoundariesFormat(item)
            }) : null, show: false
          }
        } catch (error) {
          console.log(error)
        }
      }
      //控制显示隐藏
      parentSign.show = !parentSign.show
      if (!parentSign.sign) {
        return
      }
      if (parentSign.show) {
        parentSign.sign.show()
        myJcMapEditor.addAdsorbPolygons([parentSign.sign])
      } else {
        myJcMapEditor.removeAdsorbPolygons([parentSign.sign])
        parentSign.sign.hide()
      }
    },
    customAreaReset() {
      this.reset(() => {
        myJcMapEditor.reset()
      })
    }
  }
}
