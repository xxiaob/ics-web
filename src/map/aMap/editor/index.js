/**
 * 编辑工具
 */
import JcMapEditorBase from '../../base/JcMapEditor'
import { MAP_SIGN_TYPE, MAP_EDIT_TYPE } from '@/constant/CONST'
import { PolygonStyle } from '../config'

class JcMapEditor extends JcMapEditorBase {
  /**
  * 构造
  * @param {*} options
  * @param {Object} options.debug 配置 设法开启debug 模式，默认true
  * @param {JcMap} options.map JcMap地图对象
  */
  constructor(options = {}) {
    super(options)
    this.mousetool = new this.map.AMap.MouseTool(this.map.map)
    this.mousetool.on('draw', (e) => {
      this.map.map.setDefaultCursor('default')
      this.mousetool.close(true)
      let path = e.obj.getPath()

      console.log('JcMapEditor - edit - end：', e, path)
      if (this.editObject.type == MAP_SIGN_TYPE.Polygon) {
        if (path && path.length > 2) {
          //超过三个点则为多边形
          e.obj.setMap(this.map.map)
        }
      }
    })
  }


  /**
   *初始化编辑器
   */
  initEditor() {
    if (this.sign) {
      //添加点标记

      //绘画已有数据
    }
  }

  /**
   * 新增区域
   * @param {String} type 增加区域类型
   */
  addArea(type = MAP_SIGN_TYPE.Polygon) {
    if (this.amapEditor) {
      this.amapEditor.close()
    }
    this.map.map.setDefaultCursor('crosshair')
    if (type === MAP_SIGN_TYPE.Polygon) {
      //处理矩形
      this.editObject = { type, opera: MAP_EDIT_TYPE.ADD }
      this.mousetool.polygon({ ...PolygonStyle.base, ...PolygonStyle.active })
    }
  }

  /**
   * 销毁编辑器
   */
  destroy() { }
}

export default JcMapEditor
