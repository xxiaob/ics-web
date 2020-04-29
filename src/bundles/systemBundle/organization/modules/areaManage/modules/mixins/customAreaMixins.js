/**自动设置区域 */
import { MAP_EVENT } from '@/constant/CONST'
let myJcMap //承载JcMap对象

let contextMenu //右键菜单

let polyEditor //多边形编辑对象

let target //存储操作对象

export default {
  methods: {
    initCustomArea(mapUtil) {
      myJcMap = mapUtil
      this.initContextMenu()
      //去处理显示
      this.endAutoArea()
      if (this.adcode) {
        this.hideActiveSign()
      } else {
        this.showActiveSign()
      }
      myJcMap.fitView()
    },
    initContextMenu() {
      // if (!contextMenu) {
      //   JcMapUtils.initPlugins(['AMap.MouseTool'], () => {
      //     contextMenu = new JcMapUtils.AMap.ContextMenu()
      //     contextMenu.addItem('删除该区域', this.areaDelete, 0)
      //   })
      // }
    },
    addArea() {

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
