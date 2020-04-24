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
    if (JcMapUtils.AMap) {
      JcMapUtils.map = new JcMapUtils.AMap.Map(options.source, options.mapOptions)
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
    } else {
      JcMapUtils.showConsole('地图加载中...')
      AMapLoader.load(options.loadOptions).then((AMap) => {
        JcMapUtils.AMap = AMap
        JcMapUtils.init(options, cb)
      }).catch(() => {
        JcMapUtils.showConsole('地图加载失败，请检查配置或网络...')
      })
    }
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
  },
  polygon: {
    /**
     * 添加 多边形
     * @param {Object} options 参数
     * @param {Function} cb 回调 返回Polygon 对象
     */
    add(options, cb) {
      let signs = []

      for (let i = 0, l = options.path.length; i < l; i++) {
        let sign = new JcMapUtils.AMap.Polygon({ ...options, path: options.path[i] })

        signs.push(sign)
      }

      cb(signs)
    },
    clear(signs) {
      JcMapUtils.map.remove(signs)
    }
  },
  circle: {
    /**
     * 添加 圆形
     * @param {Object} options 参数
     * @param {Function} cb 回调 返回Polygon 对象
     */
    add(options, cb) {
      let signs = []

      for (let i = 0, l = options.path.length; i < l; i++) {
        let sign = new JcMapUtils.AMap.Circle({ ...options, path: options.path[i] })

        signs.push(sign)
      }

      cb(signs)
    },
    clear(signs) {
      JcMapUtils.map.remove(signs)
    }
  },
  sign: {
    /**
     * 添加 标记
     * @param {Object} options 参数
     * @param {Function} cb 回调 返回Polygon 对象
     */
    add(options, cb) {

    },
    clear(signs) {
      JcMapUtils.map.remove(signs)
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
