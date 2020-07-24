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
 * 获取实时天气
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

/**
 * 获取查询四天预报天气
 * @param {String} city 地区名称
 */
export async function getForecastWeather(city) {
  let map = await initAmap()

  let result = await new Promise(function (resolve, reject) {
    map.plugin(['AMap.Weather'], function () {
      let amapWeather = new AMap.Weather()

      amapWeather.getForecast(city, function (err, data) {
        console.log('amap getForecastWeather:', err, data)
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


/**
 * 逆地理编码查询
 * @param {String} position 坐标地址
 */
export async function getAddressByPosition(position) {
  let map = await initAmap()

  let result = await new Promise(function (resolve, reject) {
    map.plugin(['AMap.Geocoder'], function () {
      let amapWeather = new AMap.Geocoder({ radius: 1000 })

      amapWeather.getAddress(position, function (status, res) {
        console.log('amap getAddressByPosition:', status, res)
        if (status === 'complete' && res.info === 'OK') {
          // resolve(res.regeocode.formattedAddress)
          let address = res.regeocode.addressComponent

          resolve(address.district + address.township + address.street + address.streetNumber)
        } else {
          reject('获取逆地理编码失败')
        }
      })
    })
  })

  return result
}

/**
 * 获取点聚合对象
 */
export async function getMarkerCluster() {
  let map = await initAmap()

  let result = await new Promise(function (resolve) {
    map.plugin(['AMap.MarkerCluster'], function () {
      resolve(AMap.MarkerCluster)
    })
  })

  return result
}

/**
 * 获取鼠标聚合工具
 */
export async function getMouseTool() {
  let map = await initAmap()

  let result = await new Promise(function (resolve) {
    map.plugin(['AMap.MouseTool'], function () {
      resolve(AMap.MouseTool)
    })
  })

  return result
}

/**
 * 加载动画插件
 */
export async function initMoveAnimation() {
  let map = await initAmap()

  let result = await new Promise(function (resolve) {
    map.plugin(['AMap.MoveAnimation'], function () {
      resolve()
    })
  })

  return result
}

/**
 * 获取3D地图插件
 */
export async function getMap3D() {
  let map = await initAmap()

  let result = await new Promise(function (resolve) {
    map.plugin(['AMap.Object3D', 'AMap.Object3DLayer'], function () {
      resolve()
    })
  })

  return { map3D: result, Amap: map }
}
