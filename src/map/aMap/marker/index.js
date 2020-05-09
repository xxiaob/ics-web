/**
 * 高德地图图标
 */
import JcMapmarkerBase from '../../base/JcMapMarker'
import { EventTrans, markerOptions } from '../config'
import { defaultMarker } from './template'

class JcMapmarker extends JcMapmarkerBase {
  /**
  * 构造
  * @param {*} options
  */
  constructor(options = {}) {
    super(options)
    //处理标记显示
    this.marker = new this.map.AMap.Marker({
      ...markerOptions.base,
      position: this.position,
      draggable: this.draggable
    })
    this.show()
  }

  /**
   * 显示标记
   * @param {Array} position 中心点
   */
  show(position) {
    this.marker.setContent(defaultMarker({ icon: this.icon, title: this.name, titleVisible: this.titleVisible }))
    this.setPosition(position)
    this.marker.setMap(this.map.map)
  }

  /**
   * 设置坐标点
   * @param {Array} position 中心点
   */
  setPosition(position) {
    if (position && position.length == 2) {
      this.position = position
      this.marker.setPosition(this.position)
    }
  }

  /**
   * 获取坐标点
   * @returns {Array} 坐标点
   */
  getPosition() {
    return this.marker.getPosition()
  }

  /**
   * 隐藏标记
   */
  hide() {
    this.marker.setMap(null)
  }

  /**
   * 添加事件监听
   * @param {*} event 事件名称
   * @param {*} cb 回调
   */
  on(event, cb, ...args) {
    this.marker.on(EventTrans[event] || event, cb, ...args)
  }

  /**
   * 移除事件监听
   * @param {*} event 事件名称
   * @param {*} cb 回调
   */
  off(event, ...args) {
    this.marker.off(EventTrans[event] || event, ...args)
  }
}
export default JcMapmarker
