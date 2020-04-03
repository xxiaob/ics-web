/**
 * 地图工具类，基于高德Js Api
 */
import AMapLoader from '@amap/amap-jsapi-loader'

let noop = function () { } //默认空函数

/**
 *map 工具类
 */
let JcMapUtils = {
  AMap: null,
  map: null, //创建的map 对象
  targets: {}, //存储已经初始化好的amap 对象
  initOptions: null, //初始化参数
  /**
   *  初始化地图
   * @param {*} options
   * @param {Object} options.loadOptions 地图load参数
   * @param {Object} options.mapOptions 地图创建参数
   * @param {Object} options.source 地图承接
   * @param {Function} cb 回调
   */
  init(options, cb = noop) {
    if (!JcMapUtils.AMap) {
      JcMapUtils.showConsole('地图加载中...')
      AMapLoader.load(options.loadOptions).then((AMap) => {
        JcMapUtils.AMap = AMap
        JcMapUtils.map = new AMap.Map(options.source, options.mapOptions)
        let complete = false //防止map complete事件触发多次

        JcMapUtils.map.on('complete', () => {
          if (!complete) {
            // 地图图块加载完成后触发
            JcMapUtils.showConsole('地图加载完成，开始处理标记')
            let mapEl = typeof options.source == 'string' ? document.getElementById(options.source) : options.source

            let logoEL = mapEl.querySelector('.amap-logo')

            let amapCopyrightEl = mapEl.querySelector('.amap-copyright')

            logoEL.parentNode.removeChild(logoEL)
            amapCopyrightEl.parentNode.removeChild(amapCopyrightEl)
            JcMapUtils.showConsole('标记处理完成')
            complete = true
            cb()
          }
        })
      }).catch(() => {
        JcMapUtils.showConsole('地图加载失败，请检查配置或网络...')
      })
    }
  },
  /**
   * 加载插件
   * @param {Array} plugins 插件数组
   * @param {Function} cb 回调
   */
  initPlugins(plugins, cb = noop) {
    if (!JcMapUtils.map) {
      JcMapUtils.showConsole('地图未初始化，请使用init先初始化...')
      return
    }
    JcMapUtils.showConsole('加载地图插件->' + plugins.join(','))
    JcMapUtils.AMap.plugin(plugins, function () {
      JcMapUtils.showConsole('地图插件加载完成->' + plugins.join(','))
      cb()
    })
  },
  /**
   * 行政区查询服务
   * @param {*} options 搜索参数
   * @param {Object} options.options search参数，参考 https://lbs.amap.com/api/jsapi-v2/documentation#districtsearch
   * @param {String} options.keyword 搜索关键字
   * @param {String} options.keywords 搜索附加关键字
   * @param {Function} cb 回调 返回Amap DistrictSearch标准格式
   */
  districtSearch(options, cb = noop) {
    if (JcMapUtils.AMap.DistrictSearch) {
      let defaultOptions = { showbiz: false }

      if (JcMapUtils.targets.district) {
        if (options.options.level) {
          JcMapUtils.targets.district.setLevel(options.options.level)
        }
        if (options.options.subdistrict) {
          JcMapUtils.targets.district.setSubdistrict(options.options.subdistrict)
        }
      } else {
        JcMapUtils.targets.district = new JcMapUtils.AMap.DistrictSearch(Object.assign({}, defaultOptions, options.options || {}))
      }

      JcMapUtils.targets.district.search(options.keyword, function (status, result) {
        if (status === 'complete') {
          cb(result)
        }
      }, options.keywords || '')
      // AMap.plugin(['AMap.DistrictSearch', 'AMap.Polygon'], function () {//异步加载插件
      //   let polygons = [] //存储边界数据

      //   let district = new AMap.DistrictSearch({
      //     level: 'city',
      //     extensions: 'all',
      //     subdistrict: 1, //返回下一级行政区
      //     showbiz: false //是否显示商圈
      //   })


      //   //搜索南京市
      //   district.search('320100', (status, result) => {
      //     console.log(status, result)
      //     if (status === 'complete') {
      //       //清除地图上所有覆盖物
      //       for (let i = 0, l = polygons.length; i < l; i++) {
      //         polygons[i].setMap(null)
      //       }
      //       let bounds = result.districtList[0].boundaries

      //       if (bounds) {
      //         for (let i = 0, l = bounds.length; i < l; i++) {
      //           let polygon = new AMap.Polygon({
      //             map: myMap,
      //             strokeWeight: 1,
      //             strokeColor: '#0091ea',
      //             fillColor: '#80d8ff',
      //             fillOpacity: 0.1,
      //             path: bounds[i]
      //           })

      //           polygons.push(polygon)
      //         }
      //         myMap.setFitView()//地图自适应
      //         console.log(myMap.getCenter(), myMap.getSize())
      //       }
      //     }
      //   })
      // })
    } else {
      JcMapUtils.initPlugins(['AMap.DistrictSearch'], function () {
        JcMapUtils.districtSearch(options, cb)
      })
    }
  },
  //销毁
  destroy() {
    if (JcMapUtils.map) {
      JcMapUtils.map.destroy() //销毁地图，并清空地图容器
    }
    JcMapUtils.map = null
    JcMapUtils.targets = {}
    JcMapUtils.initOptions = null
  },
  showConsole(info) {
    console.log(info)
  }
}


export default JcMapUtils
