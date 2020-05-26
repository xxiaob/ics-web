/**
 * 封装高德map
 */
import JcMapBase from '../../base/JcMap'
import { MapOptions, EventTrans } from '../config'
import { initAmap } from '../aMapUtil'

class JcMap extends JcMapBase {
  /**
   * 构造
   * @param {*} options
   * @param {Object} options.debug 配置 设法开启debug 模式，默认true
   */
  constructor(options = {}) {
    super(options)
  }

  /**
   *  初始化地图
   * @param {*} options
   * @param {Object} options.loadOptions 地图load参数
   * @param {Object} options.mapOptions 地图创建参数
   * @param {Object} options.source 地图承接, 必填
   * @returns {Promise} 返回Promise对象
   */
  async init(options) {
    if (!this.map) {
      this.console('开始初始化地图...')
      try {
        this.AMap = await initAmap()
        this.map = new this.AMap.Map(options.source, Object.assign({}, MapOptions.mapOptions, options.mapOptions || {}))

        let complete = false //防止map complete事件触发多次

        this.map.on('complete', () => {
          if (!complete) {
            // 地图图块加载完成后触发
            let mapEl = typeof options.source == 'string' ? document.getElementById(options.source) : options.source

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
   * @param {Array<JcMapSign>} signs JcMapSign对象数组
   */
  fitView(signs) {
    if (signs && signs.length) {
      let targets = []

      signs.forEach(sign => {
        if (sign.boundaries && sign.boundaries.length) {
          sign.boundaries.forEach(item => {
            if (item.target) {
              targets.push(item.target)
            }
          })
        }
      })
      this.map.setFitView(targets)
    } else {
      this.map.setFitView()
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
