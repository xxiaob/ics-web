/**
 * 高德地图
 */
import AMapLoader from '@amap/amap-jsapi-loader'
import mapConfig from './config'

let AMap = null

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


export default { init }
