/**自动设置区域 */
import { JcMapEditor } from '@/map'
import { signEditDataFormat } from '@/libs/apiFormat'
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
        myJcMapEditor = null
      }
    },
    customAreaReset() {
      this.reset(() => {
        myJcMapEditor.reset()
      })
    }
  }
}
