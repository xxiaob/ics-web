/**
 * 自定义地图标记 基础类
 * 用于定于方法和基础数据初始化，实现类见各地图mapsign
 */

class MapSignBase {
  /**
   * 构造
   * @param {*} options 初始化参数
   * @param {String} options.id //标识id，当id 为空时会生成唯一id
   * @param {*} options.extData //额外参数，用于自定义数据处理
   * @param {Map} options.map //地图对象
   * @param {Boolean} options.active //是否使用选中样式
   * @param {String} options.style //设置额外样式，取配置的对应标记类型样式key
   */
  constructor(options) {
    this.id = options.id || new Date().getTime()
    this.extData = options.extData
    this.boundaries = options.boundaries || []
    this.map = options.map || null
    this.active = options.active || false
    this.style = options.style
  }

  /**
   * 显示标记
   * @param {*} map 显示在哪个地图上
   */
  show(map) {
    if (map) {
      this.map = map
    }
  }

  /**
   * 隐藏标记
   */
  hide() { }

  /**
   * 设置样式
   * @param {String} style
   */
  setStyle(style) {
    this.style = style
  }

  get [Symbol.toStringTag]() {
    return 'MapSignBase'
  }
}

export default MapSignBase
