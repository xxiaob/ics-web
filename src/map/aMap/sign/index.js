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
    this.showArea()
    this.showTip()
  }

  /**
   * 隐藏标记
   */
  hide() {
    this.hideArea()
    this.hideTip()
  }

  /**
   * 显示中心点和说明
   * @param {Boolean} tipVisible tip是否可见
   */
  showTip(tipVisible) {
    this.tipVisible = tipVisible == false ? false : true
    if (this.tipVisible) {
      if (this.marker) {
        this.marker.show()
      } else if (this.center && this.center.length == 2) {
        this.marker = new JcMapMarker({ map: this.map, position: this.center, name: this.name, icon: this.icon })
        this.marker.on('click', () => {
          this.fitView()
        })
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
   * 显示边界区域
   * @param {Boolean} areaVisible 边界区域是否可见
   */
  showArea(areaVisible) {
    this.areaVisible = areaVisible == false ? false : true
    if (this.areaVisible && this.boundaries && this.boundaries.length) {
      let targets = []

      this.boundaries.forEach(item => {
        item.target = paintingSign(this, item)
        targets.push(item.target)
      })
      this.map.map.add(targets)
    }
  }

  /**
   * 隐藏边界区域
   */
  hideArea() {
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
