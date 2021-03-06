/**
 * 高德地图标记
 */
import JcMapSignBase from '../../base/JcMapSign'
import { MAP_SIGN_TYPE } from '@/constant/CONST'
import { EventTrans, PolygonStyle, CircleStyle, PolylineStyle } from '../config'
import { paintingSign } from '../aMapUtil'
import { JcMapMarker } from '../index'
import { getColors } from '../config'
class JcMapSign extends JcMapSignBase {
  /**
   * 构造
   * @param {*} options
   */
  constructor(options) {
    super(options)
    this.colorStyle = options.colorStyle || getColors()
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
   */
  showTip() {
    if (this.signVisible) {
      if (this.marker) {
        this.marker.icon = this.icon
        this.marker.titleVisible = this.tipVisible
        this.marker.show()
      } else if (this.center && this.center.length == 2) {
        this.marker = new JcMapMarker({ map: this.map, position: this.center, name: this.name || '标记中心点', icon: this.icon, titleVisible: this.tipVisible })
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
  showArea(areaVisible = null) {
    if (areaVisible !== null) {
      this.areaVisible = areaVisible == false ? false : true
    }

    if (this.areaVisible) {
      if (this.boundaries && this.boundaries.length) {
        let targets = []

        this.boundaries.forEach(item => {
          if (!item.target) {
            item.target = paintingSign(this, item)
            targets.push(item.target)
          }
        })
        this.map.map.add(targets)
      }
    } else {
      this.hideArea()
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
   * 获取地图对象
   * @returns {Array} 地图对象
   */
  getMapTargets() {
    let targets = []

    if (this.boundaries && this.boundaries.length) {
      this.boundaries.forEach(item => {
        if (item.target) {
          targets.push(item.target)
        }
      })
    }
    if (this.marker) {
      targets.push(...this.marker.getMapTargets())
    }
    return targets
  }

  /**
   * 添加事件监听
   * @param {*} event 事件名称
   * @param {*} cb 回调
   */
  on(event, cb, ...args) {
    if (this.boundaries && this.boundaries.length) {
      this.boundaries.forEach(item => {
        if (item.target) {
          item.target.on(EventTrans[event] || event, cb, ...args)
        }
      })
    }
  }

  /**
   * 移除事件监听
   * @param {*} event 事件名称
   * @param {*} cb 回调
   */
  off(event, ...args) {
    if (this.boundaries && this.boundaries.length) {
      this.boundaries.forEach(item => {
        if (item.target) {
          if (args && args.length) {
            item.target.off(EventTrans[event] || event, ...args)
          } else {
            item.target.clearEvents(EventTrans[event] || event)
          }
        }
      })
    }
  }

  /**
   * 设置样式为active 样式
   * @param {Boolean} active true
   */
  signActive(active = true) {
    if (this.boundaries && this.boundaries.length) {
      this.boundaries.forEach(item => {
        if (item.target) {
          let activeStyle = {}

          if (MAP_SIGN_TYPE.Polygon == item.type) {
            activeStyle = PolygonStyle[this.mapStyle || this.map.mapStyle] //显示矩形
          } else if (MAP_SIGN_TYPE.Circle == item.type) {
            activeStyle = CircleStyle[this.mapStyle || this.map.mapStyle] //显示圆形
          } else if (MAP_SIGN_TYPE.Polyline == item.type) {
            activeStyle = PolylineStyle[this.mapStyle || this.map.mapStyle] //显示矩形
          }
          item.target.setOptions(active ? activeStyle.active : activeStyle.normal)
        }
      })
    }
  }
}

export default JcMapSign
