/**
 * 高德地图图标
 */
import JcMapmarkerBase from '../../base/JcMapMarker'
import { EventTrans } from '../config'
import { defaultOrgMarkerIcon, JcIcons } from '@/config/JcIconConfig'

/**
 * 返回url
 * @param {String} icon 可以为url，也可以为JcIcons 的 key
 * @returns {String} 标记地址
 */
let getIcon = function (icon) {
  if (icon) {
    let iconItem = JcIcons[icon]

    return iconItem ? iconItem.icon : icon
  }
  return defaultOrgMarkerIcon
}

/**
 * 默认的立标marker样式
 * @param {*} options 参数
 * @param {String} options.icon 中心点标记图标，可以为url，也可以为JcIcons 的 key
 * @param {String} options.title 中心点名称
 * @param {Boolean} options.titleVisible 标题是否可见
 * @returns {String} html字符串
 */
let getMarker = function (options) {
  let result = `<div class="jc-marker-content" style="background-image: url(${getIcon(options.icon)});">`

  if (options.title && options.titleVisible) {
    result += `<div class="jc-marker-title">${options.title}</div>`
  }
  return result + '</div>'
}

class JcMapmarker extends JcMapmarkerBase {
  /**
  * 构造
  * @param {*} options
  */
  constructor(options = {}) {
    super(options)
    //处理标记显示
    if (this.draggable) {
      this.marker = new this.map.AMap.Marker({
        offset: [0, 0],
        anchor: 'center',
        zIndex: 5,
        position: this.position,
        draggable: true
      })
    } else {
      this.marker = new this.map.AMap.LabelMarker({ zIndex: 5, position: this.position, icon: { image: getIcon(this.icon), anchor: 'center', size: [30, 30] }, text: { } })
    }
    this.marker.on('mouseover', function (event) {
      event.target.setzIndex(10)
    })
    this.marker.on('mouseout', function (event) {
      event.target.setzIndex(5)
    })
    this.show()
    window.marker = this
  }

  /**
   * 显示标记
   * @param {Array} position 中心点
   */
  show(position) {
    this.setPosition(position)
    this.setContent()
    if (this.draggable) {
      this.marker.setMap(this.map.map)
    } else {
      this.map.labelsLayer.add(this.marker)
    }
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
   * 设置marker内容
   */
  setContent() {
    if (this.draggable) {
      this.marker.setContent(getMarker({ icon: this.icon, title: this.name, titleVisible: this.titleVisible }))
    } else {
      this.marker.setIcon({ image: getIcon(this.icon) })
      this.marker.setText({
        content: this.titleVisible ? this.name : '',
        direction: 'top',
        offset: [0, -3],
        style: {
          fontSize: 12,
          fillColor: '#162F77',
          padding: [3, 10],
          backgroundColor: '#ffffff',
          borderColor: '#DCDFE6',
          borderWidth: 1
        }
      })
    }
  }

  /**
   * 隐藏标记
   */
  hide() {
    if (this.draggable) {
      this.marker.setMap(null)
    } else {
      this.map.labelsLayer.remove(this.marker)
    }
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

  /**
   * 获取地图对象
   * @returns {Array} 地图对象
   */
  getMapTargets() {
    return [this.marker]
  }
}
export default JcMapmarker
