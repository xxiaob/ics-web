/**自动设置区域 */
let myJcMap //承载JcMap对象

let contextMenu //右键菜单

let polyEditor //多边形编辑对象

let target //存储操作对象

export default {
  methods: {
    initCustomArea(util) {
      myJcMap = util
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
      // this.addListener()
    },
    addArea() {
      // if (polyEditor) {
      //   polyEditor.close()
      //   polyEditor.setTarget()
      //   polyEditor.open()
      // } else {
      //   JcMapUtils.initPlugins(['AMap.PolygonEditor'], () => {
      //     polyEditor = new JcMapUtils.AMap.PolygonEditor(JcMapUtils.map)
      //     polyEditor.on('add', function (data) {
      //       let polygon = data.target

      //       polyEditor.addAdsorbPolygons(polygon)
      //       polygon.on('dblclick', () => {
      //         polyEditor.setTarget(polygon)
      //         polyEditor.open()
      //       })
      //     })
      //     this.addArea()
      //   })
      // }
    },
    addListener() {
      // JcMapUtils.map.on('click', function (e) {
      //   console.log(e)
      // })
      // JcMapUtils.map.on('rightclick', function (e) {
      //   console.log(e)
      //   target = e.target
      //   contextMenu.open(JcMapUtils.map, e.lnglat)
      // })
    },
    removeListener() {
      // JcMapUtils.map.clearEvents('click')
      // JcMapUtils.map.clearEvents('rightclick')
    },
    areaDelete() {

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
