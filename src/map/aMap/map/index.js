/**
 * 封装高德map
 */
import JcMapBase from '../../base/JcMap'
import { MapOptions, EventTrans } from '../config'
import { initAmap } from '../aMapUtil'
import { mapStyle } from '@/map/mapConst'

class JcMap extends JcMapBase {
  /**
   * 构造
   * @param {*} options
   * @param {Object} options.debug 配置 设法开启debug 模式，默认true
   */
  constructor(options = {}) {
    super(options)
    this.zooms = [2, 20]
  }

  /**
   *  初始化地图
   * @param {Dom|String} source 地图承接, 必填
   * @param {*} options 地图额外参数
   * @returns {Promise} 返回Promise对象
   */
  async init(source, options = {}) {
    if (!this.map) {
      this.console('开始初始化地图...')
      try {
        this.AMap = await initAmap()
        this.map = new this.AMap.Map(source, Object.assign({ ...MapOptions.mapOptions[this.mapStyle], zooms: this.zooms }, options))

        this.tipTimes = 0 //初始化清除次数为0

        this.clearAmapTip(source) //清除高德地图标志

        //设置地图 LabelsLayer
        this.labelsLayer = new this.AMap.LabelsLayer({ collision: false, allowCollision: true })

        this.map.add(this.labelsLayer) //添加到地图图层
      } catch (error) {
        this.console('地图加载失败，请检查配置或网络...', error)
      }
    }
    return this
  }

  clearAmapTip(source) {
    let mapEl = typeof source == 'string' ? document.getElementById(source) : source

    let logoEL = mapEl.querySelector('.amap-logo')

    let amapCopyrightEl = mapEl.querySelector('.amap-copyright')

    if (logoEL && amapCopyrightEl) {
      logoEL.parentNode.removeChild(logoEL)
      amapCopyrightEl.parentNode.removeChild(amapCopyrightEl)
    } else if (this.tipTimes < 8) {
      this.tipTimes += 1
      setTimeout(() => {
        this.clearAmapTip(source)
      }, 500)
    }
  }

  /**
   * 移除所有标记
   */
  clearSign() {
    this.map.clearMap() //清除所有标记
  }

  /**
   * 地图自适应 显示
   * @param {Array<JcMapSign | JcMapMarker>} signs 地图对象数组
   */
  fitView(signs) {
    if (signs && signs.length) {
      let targets = []

      signs.forEach(sign => {
        targets.push(...sign.getMapTargets())
      })
      this.map.setFitView(targets)
    } else {
      this.map.setFitView()
    }
  }

  /**
   * 设置地图样式
   * @param {String} style 地图样式
   */
  setMapStyle(style) {
    //如果样式没变，则不进行更改
    if (style == this.mapStyle) {
      return
    }
    this.mapStyle = style
    this.console('Amap setMapStyle', style)
    if (style == mapStyle.SATELLITE) {
      this.map.setLayers([new this.AMap.TileLayer.Satellite({ zooms: this.zooms }), this.labelsLayer])
    } else {
      this.map.setMapStyle(MapOptions.mapOptions[this.mapStyle].mapStyle)
      this.map.setLayers([new this.AMap.createDefaultLayer({ zooms: this.zooms }), this.labelsLayer]) //eslint-disable-line
    }
  }

  /**
   * 设置地图缩放等级
   * @param {Array} zooms 地图缩放等级
   */
  setZooms(zooms) {
    this.zooms = zooms
    let layers = this.map.getLayers()

    layers.forEach(layer => {
      layer.setZooms(zooms)
    })
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

  /**
   * 销毁地图
   */
  destroy() {
    if (this.map) {
      this.map.destroy()
      this.map = null
    }
  }
}

export default JcMap
