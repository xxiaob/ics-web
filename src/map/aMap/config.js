/**
 * 高德地图配置数据
 */
import { mapStyle } from '@/map/mapConst'

//事件转换
export const EventTrans = {}

//颜色数组
let colorIndex = 0

export const Colors = ['#0183ff', '#fc005b', '#00b746', '#a68de1', '#ab00b5', '#2ec5cb', '#d56016']

//获取随机颜色
export function getColors() {
  console.log('colorIndex', colorIndex)
  let useColor = Colors[colorIndex++ % Colors.length]

  return { strokeColor: useColor, fillColor: useColor }
}

//地图样式配置参数
export const MapStyle = {
  [mapStyle.BASE]: 'amap://styles/4d5e9e63cd0cb4288ea45de390833e3a',
  [mapStyle.DARK]: 'amap://styles/d7ecd81fc4cd576463f7dbc8e03396e7',
  [mapStyle.SATELLITE]: mapStyle.SATELLITE
}

//地图配置数据
export const MapOptions = {
  loadOptions: {
    key: process.env.aMapConfig.accessKey, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.MouseTool', 'AMap.Polygon', 'AMap.Circle', 'AMap.Polyline', 'AMap.PolygonEditor', 'AMap.CircleEditor', 'AMap.PolylineEditor', 'AMap.PlaceSearch', 'AMap.MoveAnimation'] //插件列表
  },
  mapOptions: {
    [mapStyle.BASE]: { mapStyle: MapStyle[mapStyle.BASE], viewMode: '3D' },
    [mapStyle.DARK]: { mapStyle: MapStyle[mapStyle.DARK], viewMode: '3D' },
    [mapStyle.SATELLITE]: {}
  }
}

//多边形样式
export const PolygonStyle = {
  [mapStyle.BASE]: {
    base: {
      strokeWeight: 1,
      fillOpacity: 0.16,
      strokeStyle: 'dashed'
    },
    normal: { fillOpacity: 0.16 },
    active: { fillOpacity: 0.32 }
  },
  [mapStyle.DARK]: {
    base: {
      strokeWeight: 1,
      fillOpacity: 0.16,
      strokeStyle: 'dashed'
    },
    normal: { fillOpacity: 0.16 },
    active: { fillOpacity: 0.32 }
  },
  [mapStyle.SATELLITE]: {
    base: {
      strokeWeight: 1,
      fillOpacity: 0.16,
      strokeStyle: 'dashed'
    },
    normal: { fillOpacity: 0.16 },
    active: { fillOpacity: 0.32 }
  }
}

//圆形样式
export const CircleStyle = {
  [mapStyle.BASE]: {
    base: {
      strokeWeight: 1,
      fillOpacity: 0.16,
      strokeStyle: 'dashed'
    },
    normal: { fillOpacity: 0.16 },
    active: { fillOpacity: 0.32 }
  },
  [mapStyle.DARK]: {
    base: {
      strokeWeight: 1,
      fillOpacity: 0.16,
      strokeStyle: 'dashed'
    },
    normal: { fillOpacity: 0.16 },
    active: { fillOpacity: 0.32 }
  },
  [mapStyle.SATELLITE]: {
    base: {
      strokeWeight: 1,
      fillOpacity: 0.16,
      strokeStyle: 'dashed'
    },
    normal: { fillOpacity: 0.16 },
    active: { fillOpacity: 0.32 }
  }
}

//线的样式
export const PolylineStyle = {
  [mapStyle.BASE]: {
    base: {
      strokeWeight: 6,
      strokeStyle: 'dashed',
      lineJoin: 'round',
      lineCap: 'round'
    },
    normal: { fillOpacity: 0.16 },
    active: { fillOpacity: 0.32 }
  },
  [mapStyle.DARK]: {
    base: {
      strokeWeight: 6,
      strokeStyle: 'dashed',
      lineJoin: 'round',
      lineCap: 'round'
    },
    normal: { fillOpacity: 0.16 },
    active: { fillOpacity: 0.32 }
  },
  [mapStyle.SATELLITE]: {
    base: {
      strokeWeight: 6,
      strokeStyle: 'dashed',
      lineJoin: 'round',
      lineCap: 'round'
    },
    normal: { fillOpacity: 0.16 },
    active: { fillOpacity: 0.32 }
  }

}

//搜索参数
export const SearchOptions = {
  PlaceSearchOptions: { //设置PlaceSearch属性
    city: '南京市', //城市
    type: '', //数据类别
    pageSize: 10, //每页结果数,默认10
    pageIndex: 1, //请求页码，默认1
    extensions: 'base' //返回信息详略，默认为base（基本信息）
  }
}
