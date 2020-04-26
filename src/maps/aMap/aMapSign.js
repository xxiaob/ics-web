/**
 * 高德地图自定义标记 实现
 */
import MapSignBase from '../mapSignBase'

class AmapSign extends MapSignBase {
  /**
     * 构造
     * @param {*} options
     */
  constructor(options) {
    super(options)
  }

  /**
   * 显示标记
   */
  show() { }

  /**
   * 隐藏标记
   */
  hide() { }

  /**
   * 设置样式
   * @param {String} style
   */
  setStyle(style) {
    super.setStyle(style)
  }

  get [Symbol.toStringTag]() {
    return 'AmapSign'
  }
}

export default AmapSign
