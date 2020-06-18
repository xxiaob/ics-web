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
   * @returns {Promise} 返回Promise对象
   */
  async init(source) {
    if (!this.map) {
      this.console('开始初始化地图...')
      try {
        this.AMap = await initAmap()
        this.map = new this.AMap.Map(source, { ...MapOptions.mapOptions[this.mapStyle], zooms: this.zooms })

        let complete = false //防止map complete事件触发多次

        this.map.on('complete', () => {
          if (!complete) {
            // 地图图块加载完成后触发
            let mapEl = typeof source == 'string' ? document.getElementById(source) : source

            let logoEL = mapEl.querySelector('.amap-logo')

            let amapCopyrightEl = mapEl.querySelector('.amap-copyright')

            logoEL.parentNode.removeChild(logoEL)
            amapCopyrightEl.parentNode.removeChild(amapCopyrightEl)
            complete = true
          }
        })
      } catch (error) {
        this.console('地图加载失败，请检查配置或网络...', error)
      }
    }
    return this
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
      this.map.setLayers([new this.AMap.TileLayer.Satellite({ zooms: this.zooms })])
    } else {
      this.map.setMapStyle(MapOptions.mapOptions[this.mapStyle].mapStyle)
      this.map.setLayers([new this.AMap.createDefaultLayer({ zooms: this.zooms })]) //eslint-disable-line
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
    if (args && args.length) {
      this.map.off(EventTrans[event] || event, ...args)
    } else {
      this.map.clearEvents(EventTrans[event] || event)
    }
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
