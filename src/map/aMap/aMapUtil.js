/**
 * 高德地图工具类
 */
import AMapLoader from '@amap/amap-jsapi-loader'
import { MAP_SIGN_TYPE } from '@/constant/CONST'
import { MapOptions, PolygonStyle, CircleStyle, PolylineStyle } from './config'

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
  } else if (MAP_SIGN_TYPE.Circle == boundary.type) {
    //显示圆形
    return new sign.map.AMap.Circle(Object.assign({ center: boundary.center, radius: boundary.radius, extData: { sign, boundary } }, CircleStyle.base, sign.active ? CircleStyle.active : {}, sign.style && CircleStyle[sign.style] ? CircleStyle[sign.style] : {}))
  } else if (MAP_SIGN_TYPE.Polyline == boundary.type) {
    //显示矩形
    return new sign.map.AMap.Polyline(Object.assign({ path: boundary.path, extData: { sign, boundary } }, PolylineStyle.base, sign.active ? PolylineStyle.active : {}, sign.style && PolylineStyle[sign.style] ? PolylineStyle[sign.style] : {}))
  }
}

/**
 * 获取中心点
 * @param {*} boundary 边界对象
 * @returns {Array} 坐标点
 */
export function getCenter(boundary) {
  if (MAP_SIGN_TYPE.Polygon == boundary.type) {
    //矩形
    let path = boundary.target.getPath()

    let lng = 0, lat = 0

    path.forEach(item => {
      lat += item.lat
      lng += item.lng
    })
    return [lng / path.length, lat / path.length]
  } else if (MAP_SIGN_TYPE.Circle == boundary.type) {
    //圆形
    let center = boundary.target.getCenter()

    return [center.lng, center.lat]
  }
  return []
}
