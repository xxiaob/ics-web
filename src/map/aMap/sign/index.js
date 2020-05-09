/**
 * 高德地图标记
 */
import JcMapSignBase from '../../base/JcMapSign'
import { EventTrans } from '../config'
import { paintingSign } from '../aMapUtil'
import { JcMapMarker } from '../index'

class JcMapSign extends JcMapSignBase {
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
  show() {
    this.hide() //移除所有的标记
    if (this.boundaries && this.boundaries.length) {
      this.boundaries.forEach(item => {
        item.target = paintingSign(this, item)
        this.map.map.add(item.target)
      })
    }
    this.showTip()
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
    this.hideTip()
  }

  /**
   * 显示中心点和说明
   */
  showTip() {
    if (this.tipVisible) {
      if (this.marker) {
        this.marker.show()
      } else {
        this.marker = new JcMapMarker({ map: this.map, position: this.center, name: this.name })
      }
    } else {
      this.hideTip()
    }
  }

  /**
   * 隐藏中心点和说明
   */
  hideTip() {
    if (this.marker) {
      this.marker.hide()
    }
  }

  /**
   * 添加事件监听
   * @param {*} event 事件名称
   * @param {*} cb 回调
   */
  on(event, cb, ...args) {
    this.map.on(EventTrans[event] || event, cb, ...args)
  }

  /**
   * 移除事件监听
   * @param {*} event 事件名称
   * @param {*} cb 回调
   */
  off(event, ...args) {
    this.map.off(EventTrans[event] || event, ...args)
  }
}

export default JcMapSign
