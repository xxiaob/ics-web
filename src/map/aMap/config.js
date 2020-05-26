/**
 * 高德地图配置数据
 */
import { mapStyle } from '@/map/mapConst'

//事件转换
export const EventTrans = {}

//地图样式配置参数
export const MapStyle = {
  [mapStyle.BASE]: 'amap://styles/df688c24215141f7d10385089cad4d4a',
  [mapStyle.DARK]: 'amap://styles/20e11eef65806a574506d42f2c8d0f6c',
  [mapStyle.SATELLITE]: mapStyle.SATELLITE
}

//地图配置数据
export const MapOptions = {
  loadOptions: {
    key: 'c3282c235dc7d1aa55244c9be6de81ce', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.MouseTool', 'AMap.Polygon', 'AMap.Circle', 'AMap.Polyline', 'AMap.PolygonEditor', 'AMap.CircleEditor', 'AMap.PolylineEditor', 'AMap.PlaceSearch'] //插件列表
  },
  mapOptions: {
    [mapStyle.BASE]: { mapStyle: MapStyle[mapStyle.BASE], viewMode: '3D' },
    [mapStyle.DARK]: { mapStyle: MapStyle[mapStyle.DARK], viewMode: '3D' },
    [mapStyle.SATELLITE]: { viewMode: '3D' }
  }
}

//多边形样式
export const PolygonStyle = {
  [mapStyle.BASE]: {
    base: {
      strokeWeight: 1,
      strokeColor: '#0183ff',
      fillColor: '#0183ff',
      fillOpacity: 0.1,
      strokeStyle: 'dashed'
    },
    normal: { fillOpacity: 0.1 },
    active: { fillOpacity: 0.3 }
  },
  [mapStyle.DARK]: {
    base: {
      strokeWeight: 1,
      strokeColor: '#0183ff',
      fillColor: '#0183ff',
      fillOpacity: 0.1,
      strokeStyle: 'dashed'
    },
    normal: { fillOpacity: 0.1 },
    active: { fillOpacity: 0.3 }
  },
  [mapStyle.SATELLITE]: {
    base: {
      strokeWeight: 1,
      strokeColor: '#0183ff',
      fillColor: '#0183ff',
      fillOpacity: 0.1,
      strokeStyle: 'dashed'
    },
    normal: { fillOpacity: 0.1 },
    active: { fillOpacity: 0.3 }
  }
}

//圆形样式
export const CircleStyle = {
  [mapStyle.BASE]: {
    base: {
      strokeWeight: 1,
      strokeColor: '#0183ff',
      fillColor: '#0183ff',
      fillOpacity: 0.1,
      strokeStyle: 'dashed'
    },
    normal: { fillOpacity: 0.1 },
    active: { fillOpacity: 0.3 }
  },
  [mapStyle.DARK]: {
    base: {
      strokeWeight: 1,
      strokeColor: '#0183ff',
      fillColor: '#0183ff',
      fillOpacity: 0.1,
      strokeStyle: 'dashed'
    },
    normal: { fillOpacity: 0.1 },
    active: { fillOpacity: 0.3 }
  },
  [mapStyle.SATELLITE]: {
    base: {
      strokeWeight: 1,
      strokeColor: '#0183ff',
      fillColor: '#0183ff',
      fillOpacity: 0.1,
      strokeStyle: 'dashed'
    },
    normal: { fillOpacity: 0.1 },
    active: { fillOpacity: 0.3 }
  }
}

//线的样式
export const PolylineStyle = {
  [mapStyle.BASE]: {
    base: {
      strokeWeight: 2,
      strokeColor: '#0183ff',
      strokeStyle: 'dashed',
      lineJoin: 'round',
      lineCap: 'round'
    },
    normal: { fillOpacity: 0.1 },
    active: { fillOpacity: 0.3 }
  },
  [mapStyle.DARK]: {
    base: {
      strokeWeight: 2,
      strokeColor: '#0183ff',
      strokeStyle: 'dashed',
      lineJoin: 'round',
      lineCap: 'round'
    },
    normal: { fillOpacity: 0.1 },
    active: { fillOpacity: 0.3 }
  },
  [mapStyle.SATELLITE]: {
    base: {
      strokeWeight: 2,
      strokeColor: '#0183ff',
      strokeStyle: 'dashed',
      lineJoin: 'round',
      lineCap: 'round'
    },
    normal: { fillOpacity: 0.1 },
    active: { fillOpacity: 0.3 }
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

import { defaultMarker } from './marker/template'
//market配置参数
export const markerOptions = {
  [mapStyle.BASE]: {
    base: {
      anchor: [-9, -54]
    },
    getContent: defaultMarker
  },
  [mapStyle.DARK]: {
    base: {
      anchor: [-9, -54]
    },
    getContent: defaultMarker
  },
  [mapStyle.SATELLITE]: {
    base: {
      anchor: [-9, -54]
    },
    getContent: defaultMarker
  }
}
