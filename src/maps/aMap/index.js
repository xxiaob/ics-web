/**
 * 高德地图
 */
import AMapLoader from '@amap/amap-jsapi-loader'
import mapConfig from './config'
import { MAP_SIGN_TYPE } from '@/constant/CONST'

let AMap = null

let EventTrans = {} //事件转换

/**
 *  初始化地图
 * @param {*} options
 * @param {Object} options.loadOptions 地图load参数
 * @param {Object} options.mapOptions 地图创建参数
 * @param {Object} options.source 地图承接
 * @returns {Promise} 返回Promise对象
 */
export async function init(options) {
  if (!AMap) {
    AMap = await AMapLoader.load(Object.assign({}, mapConfig.MapOptions.loadOptions, options.loadOptions || {}))
  }
  let map = new AMap.Map(options.source, Object.assign({}, mapConfig.MapOptions.mapOptions, options.mapOptions || {}))

  let complete = false //防止map complete事件触发多次

  map.on('complete', () => {
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
  return map
}


/**
 * 绘画标记
 * @param {JcMapSign} sign JcMapSign对象数组
 * @param {Object} boundary boundary对象
 * @returns {Object} 返回对象
 */
export function paintingSign(sign, boundary) {
  if (MAP_SIGN_TYPE.Polygon == boundary.type) {
    //显示矩形
    return new AMap.Polygon(Object.assign({ path: boundary.path, extData: { sign, boundary } }, mapConfig.PolygonStyle.base, sign.active ? mapConfig.PolygonStyle.active : {}, sign.style && mapConfig.PolygonStyle[sign.style] ? mapConfig.PolygonStyle[sign.style] : {}))
  }
}

/**
 * 清除所有标记
 * @param {AMap} map 地图对象
 */
export function clearMap(map) {
  map.clearMap() //清除所有标记
}

/**
 * 地图自适应 显示
 * @param {AMap} map 地图对象
 * @param {Array<JcMapSign>} signs JcMapSign对象数组
 */
export function fitView(map, signs) {
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
    map.setFitView(targets)
  } else {
    map.setFitView()
  }
}

/**
 * 添加事件监听
 * @param {*} target 事件体
 * @param {*} event 事件名称
 * @param {*} cb 回调
 */
export function addEvent(target, event, cb, ...args) {
  target.on(EventTrans[event] || event, cb, ...args)
}

/**
 * 移除事件监听
 * @param {*} target 事件体
 * @param {*} event 事件名称
 */
export function removeEvent(target, event, ...args) {
  target.off(EventTrans[event] || event, ...args)
}

/**
 * 销毁map
 * @param {*} map map 对象
 */
export function destroy(map) {
  map.destroy()
}

export default { init, paintingSign, fitView, addEvent, removeEvent, clearMap, destroy }
