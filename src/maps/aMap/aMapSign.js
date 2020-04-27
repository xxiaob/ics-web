/**
 * 高德地图自定义标记 实现
 */
import MapSignBase from '../mapSignBase'
import { paintingSign } from './index'

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
   * @param {*} map 显示在哪个地图上
   */
  show(map) {
    super.show(map)
    this.hide() //移除所有的标记
    if (this.boundaries && this.boundaries.length) {
      this.boundaries.forEach(item => {
        item.target = paintingSign(this, item)
      })
    }
  }

  /**
   * 隐藏标记
   */
  hide() {
    if (this.boundaries && this.boundaries.length) {
      this.boundaries.forEach(item => {
        if (item.target) {
          item.target.setMap(null)
          item.target = null
        }
      })
    }
  }

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
