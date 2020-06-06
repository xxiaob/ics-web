/**
 * 地图基础类，提供继承类必须重写的方法
 */
import { mapStyle } from '@/map/mapConst'

class JcMap {
  /**
   * 构造
   * @param {*} options
   * @param {Object} options.debug 配置 设法开启debug 模式，默认true
   * @param {String} options.mapStyle 地图使用样式key,对应mapStyle枚举
   */
  constructor(options = {}) {
    this.mapStyle = options.mapStyle || mapStyle.BASE
    this.debug = options.debug || true
  }

  /**
   * 初始化
   */
  async init() { }

  /**
   * 地图自适应 显示
   * @param {Array<JcMapSign>} signs JcMapSign对象数组，非必填
   */
  fitView() { }

  /**
   * 添加事件监听
   * @param {*} event 事件名称
   * @param {*} cb 回调
   */
  on() { }

  /**
   * 移除事件监听
   * @param {*} event 事件名称
   * @param {Function} cb 需要移除的回调
   */
  off() { }

  /**
   * 添加标记
   * @param {Array<JcMapSign | JcMapMarker>} signs 地图对象数组
   */
  async addSign(signs) {
    if (signs && signs.length) {
      signs.forEach(item => {
        item.setMap(this)
      })
    }
  }

  /**
   * 删除标记
   * @param {Array<JcMapSign | JcMapMarker>} signs 地图对象数组
   */
  async removeSign(signs) {
    if (signs && signs.length) {
      signs.forEach(item => {
        item.hide()
      })
    }
  }

  /**
   * 移除所有标记
   */
  clearSign() { }

  /**
   * 销毁地图
   */
  destroy() { }

  /**
   * 日志输出
   */
  console() {
    if (this.debug) {
      console.log(...arguments)
    }
  }

  get [Symbol.toStringTag]() {
    return 'JcMap'
  }
}

export default JcMap
