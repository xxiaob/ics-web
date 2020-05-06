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
    this.contextMenu = new this.map.AMap.ContextMenu()
    this.contextMenu.addItem('删除改区域', (e) => {
      this.console(e)
    }, 0)

    this.mousetool.on('draw', (e) => {
      this.map.map.setDefaultCursor('default')
      this.mousetool.close(true)
      let path = e.obj.getPath()

      this.console('JcMapEditor - edit - end：', e, path)
      if (this.editObject.type == MAP_SIGN_TYPE.Polygon) {
        if (path && path.length > 2) {
          //超过三个点则为多边形
          e.obj.setMap(this.map.map)
          this.editObject.target = e.obj
          this.addboundary(this.editObject)
        }
      }
      this.editObject = null //清空编辑器
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
    this.endAmapEditor()
    this.map.map.setDefaultCursor('crosshair')
    if (type === MAP_SIGN_TYPE.Polygon) {
      //处理矩形
      this.editObject = { id: new Date().getTime(), type, opera: MAP_EDIT_TYPE.ADD }
      this.mousetool.polygon({ ...PolygonStyle.base, ...PolygonStyle.active })
    }
  }

  /**
   * 新增边界
   * @param {*} boundary 边界对象
   */
  addboundary(boundary) {
    if (this.boundaries && this.boundaries.length) {
      this.boundaries.push(boundary)
    } else {
      this.boundaries = [boundary]
    }
    this.refreshListener()
    this.console('新增之后启用编辑', boundary)
    this.startEdit(boundary)
  }

  /**
   * 刷新监听
   */
  refreshListener() {
    if (this.boundaries && this.boundaries.length) {
      this.boundaries.forEach(item => {
        item.target.clearEvents()
        if (item.opera != MAP_EDIT_TYPE.DELETE) {
          //双击开始结束编辑
          item.target.on('dblclick', () => {
            this.console('boundary - dblclick - item', item)
            this.startEdit(item)
          })
          //右键显示菜单
          item.target.on('rightclick', (e) => {
            this.console('boundary - rightclick - item', item)
            this.contextMenu.open(item.target.getMap(), e.lnglat)
          })
        }
      })
    }
  }
  /**
   * 启用编辑器
   * @param {*} item 编辑的边界对象
   */
  startEdit(item) {
    this.endAmapEditor()
    if (this.editItem && this.editItem.id == item.id) {
      this.editItem = null //如果双击的是自己，则结束编辑
      return
    }
    this.editItem = item

    if (item.type == MAP_SIGN_TYPE.Polygon) {
      //如果是矩形，则使用矩形编辑器
      this.amapEditor = new this.map.AMap.PolygonEditor(this.map.map)
      let adsorbPolygons = []

      this.boundaries.forEach(boundary => {
        if (boundary.id != item.id && boundary.type == MAP_SIGN_TYPE.Polygon) {
          adsorbPolygons.push(boundary.target)
        }
      })
      this.amapEditor.setAdsorbPolygons(adsorbPolygons)
      this.amapEditor.setTarget(item.target)
      this.amapEditor.on('end', (e) => {
        this.console('amapEditor - end ->', item)
        this.endEdit(item, e.target)
      })
      this.amapEditor.open()
    }
  }

  /**
   * 结束编辑
   * @param {*} item 结束编辑的对象
   * @param {*} target 结束编辑后替换的对象
   */
  endEdit(item, target) {
    //如果当前对象还没有被操作，则设置操作为编辑
    if (!item.opera) {
      item.opera = MAP_EDIT_TYPE.EDIT
    }
    //清除原有对象，设置更新为新对象
    item.target.clearEvents()
    item.target.setMap()
    item.target = target
    item.target.setMap(this.map.map)
    this.refreshListener()
  }

  /**
   * 结束编辑
   */
  endAmapEditor() {
    if (this.amapEditor) {
      this.console('结束编辑-----')
      this.amapEditor.close()
      this.amapEditor.clearEvents()
    }
  }
  /**
   * 销毁编辑器
   */
  destroy() {
    this.endAmapEditor()
  }
}

export default JcMapEditor
