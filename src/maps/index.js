/**
 * 第三方地图通用入口
 */

import JcMapUtils from './aMap'

class JcMap {
  /**
   * 构造
   * @param {*} options
   * @param {Object} options.debug 配置 设法开启debug 模式，默认true
   */
  constructor(options = {}) {
    this.debug = options.debug || true
  }

  /**
   *  初始化地图
   * @param {*} options
   * @param {Object} options.loadOptions 地图load参数
   * @param {Object} options.mapOptions 地图创建参数
   * @param {Object} options.source 地图承接
   * @returns {Promise} 返回Promise对象
   */
  async init(options) {
    if (!this.map) {
      this.showConsole('开始初始化地图...')
      try {
        this.map = await JcMapUtils.init(options)
      } catch (error) {
        this.showConsole('地图加载失败，请检查配置或网络...', error)
      }
    }
    return this
  }

  /**
   * 绘画标记
   * @param {Array} signs JcMapSign对象数组
   */
  async paintingSign(signs) {
    if (signs && signs.length) {
      signs.forEach(item => {
        item.show(this.map)
      })
    }
  }

  /**
   * 删除绘画标记
   * @param {Array} signs JcMapSign对象数组，如果signs为空则是清除所有数据
   */
  async cleargSign(signs) {
    if (signs && signs.length) {
      signs.forEach(item => {
        item.hide()
      })
    } else {
      JcMapUtils.clearMap(this.map) //清除所有标记
    }
  }

  /**
   * 地图自适应 显示
   * @param {Array<JcMapSign>} signs JcMapSign对象数组
   */
  fitView(signs) {
    JcMapUtils.fitView(this.map, signs)
  }

  /**
 * 添加事件监听
 * @param {*} event 事件名称
 * @param {*} cb 回调
 */
  on(event, cb, ...args) {
    JcMapUtils.addEvent(this.map, event, cb, ...args)
  }

  /**
 * 移除事件监听
 * @param {*} event 事件名称
 */
  off(event, ...args) {
    JcMapUtils.removeEvent(this.map, event, ...args)
  }

  showConsole() {
    if (this.debug) {
      console.log(...arguments)
    }
  }

  destroy() {
    if (this.map) {
      JcMapUtils.destroy(this.map)
      this.map = null
    }
  }

  get [Symbol.toStringTag]() {
    return 'JcMap'
  }
}

export default JcMap
