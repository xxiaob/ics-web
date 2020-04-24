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
  constructor(options) {
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
    this.showConsole('开始初始化地图...')
    if (!this.map) {
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
   * @param {*} signs
   */
  async paintingSign(signs) {

  }


  showConsole() {
    if (this.debug) {
      console.log(arguments)
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
