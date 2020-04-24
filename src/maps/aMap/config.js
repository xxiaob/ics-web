/**
 * 地图配置数据
 */

//地图配置数据
export const MapOptions = {
  loadOptions: {
    key: 'c3282c235dc7d1aa55244c9be6de81ce', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.DistrictSearch', 'AMap.MouseTool', 'AMap.Polygon', 'AMap.Circle'] //插件列表
  },
  mapOptions: {
    viewMode: '3D'
  }
}

//多边形样式
export const PolygonStyle = {
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

export default { MapOptions, PolygonStyle }
