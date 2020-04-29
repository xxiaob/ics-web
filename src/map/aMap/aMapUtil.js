/**
 * 高德地图工具类
 */
import { MAP_SIGN_TYPE } from '@/constant/CONST'
import { PolygonStyle } from './config'

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
