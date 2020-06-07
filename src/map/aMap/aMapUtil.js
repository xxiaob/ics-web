/**
 * 高德地图工具类
 */
import AMapLoader from '@amap/amap-jsapi-loader'
import { MAP_SIGN_TYPE } from '@/constant/CONST'
import { MapOptions, PolygonStyle, CircleStyle, PolylineStyle } from './config'

let AMap = null //地图对象

/**
 * 初始化Amap对象
 * @returns {Amap} 对象
 */
export async function initAmap() {
  if (!AMap) {
    AMap = await AMapLoader.load(MapOptions.loadOptions)
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
  console.log('aMap绘画标记', sign, boundary)
  if (MAP_SIGN_TYPE.Polygon == boundary.type) {
    //显示矩形
    let activeStyle = PolygonStyle[sign.mapStyle || sign.map.mapStyle]

    return new sign.map.AMap.Polygon(Object.assign({ path: boundary.path, extData: { sign, boundary } }, activeStyle.base, sign.colorStyle, sign.active ? activeStyle.active : {}))
  } else if (MAP_SIGN_TYPE.Circle == boundary.type) {
    //显示圆形
    let activeStyle = CircleStyle[sign.mapStyle || sign.map.mapStyle]

    return new sign.map.AMap.Circle(Object.assign({ center: boundary.center, radius: boundary.radius, extData: { sign, boundary } }, activeStyle.base, sign.colorStyle, sign.active ? activeStyle.active : {}))
  } else if (MAP_SIGN_TYPE.Polyline == boundary.type) {
    //显示矩形
    let activeStyle = PolylineStyle[sign.mapStyle || sign.map.mapStyle]

    return new sign.map.AMap.Polyline(Object.assign({ path: boundary.path, extData: { sign, boundary } }, activeStyle.base, sign.colorStyle, sign.active ? activeStyle.active : {}))
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

/**
 * 获取天气
 * @param {String} city 地区名称
 */
export async function getLiveWeather(city) {
  let map = await initAmap()

  let result = await new Promise(function (resolve, reject) {
    map.plugin(['AMap.Weather'], function () {
      let amapWeather = new AMap.Weather()

      amapWeather.getLive(city, function (err, data) {
        console.log('amap getLiveWeather:', err, data)
        if (err) {
          reject('获取天气失败')
        } else {
          resolve(data)
        }
      })
    })
  })

  return result
}
