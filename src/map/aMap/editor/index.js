/**
 * 编辑工具
 */
import JcMapEditorBase from '../../base/JcMapEditor'
import { MAP_SIGN_TYPE } from '@/constant/CONST'

class JcMapEditor extends JcMapEditorBase {
  /**
  * 构造
  * @param {*} options
  * @param {Object} options.debug 配置 设法开启debug 模式，默认true
  * @param {JcMap} options.map JcMap地图对象
  */
  constructor(options = {}) {
    super(options)
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
  }
}

export default JcMapEditor
