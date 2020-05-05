/**自动设置区域 */
import { JcMapEditor } from '@/map'
let myJcMap //承载JcMap对象

let myJcMapEditor //承载编辑体

export default {
  methods: {
    initCustomArea(mapUtil) {
      myJcMap = mapUtil
      //去处理显示
      this.endAutoArea()

      let sign = null

      if (this.adcode) {
        this.hideActiveSign()
      } else {
        sign = this.getActiveSign()
      }
      myJcMapEditor = new JcMapEditor({ map: myJcMap, sign })
      myJcMap.fitView()
    },
    addArea() {
      myJcMapEditor.addArea()
    },
    endCustomArea() {

    },
    customAreaReset() {
      this.reset(() => {
        this.endCustomArea()
        this.initCustomArea(myJcMap)
      })
    }
  }
}
