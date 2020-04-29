/**
 * 高德地图工具类
 */
import AMapLoader from '@amap/amap-jsapi-loader'
import { MAP_SIGN_TYPE } from '@/constant/CONST'
import { MapOptions, PolygonStyle } from './config'

let AMap = null //地图对象

/**
 * 初始化Amap对象
 * @param {Object} options amap load 参数
 * @returns {Amap} 对象
 */
export async function initAmap(options) {
  if (!AMap) {
    AMap = await AMapLoader.load(Object.assign({}, MapOptions.loadOptions, options || {}))
  }
  return AMap
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
    return new sign.map.AMap.Polygon(Object.assign({ path: boundary.path, extData: { sign, boundary } }, PolygonStyle.base, sign.active ? PolygonStyle.active : {}, sign.style && PolygonStyle[sign.style] ? PolygonStyle[sign.style] : {}))
  }
}
