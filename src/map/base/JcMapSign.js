/**
 * 地图标记基础类
 */
class JcMapSign {
  /**
   * 构造
   * @param {*} options 初始化参数
   * @param {String} options.id 标识id，当id 为空时会生成唯一id
   * @param {String} options.name 标记名称
   * @param {*} options.extData 额外参数，用于自定义数据处理
   * @param {Array<String>} options.center 标记中心点
   * @param {JcMap} options.map JcMap地图对象
   * @param {Boolean} options.active 是否使用选中样式
   * @param {Boolean} options.debug 配置 设法开启debug 模式，默认true
   * @param {String} options.style 设置额外样式，取配置的对应标记类型样式key
   * @param {Array} options.boundaries 边界数组
   */
  constructor(options) {
    this.debug = options.debug || true
    this.id = options.id || new Date().getTime()
    this.name = options.name || ''
    this.extData = options.extData
    this.center = options.center || []
    this.boundaries = options.boundaries || []
    this.map = options.map || null
    this.active = options.active || false
    this.style = options.style
  }

  /**
   * 显示标记
   */
  show() { }

  /**
   * 设置map
   * @param {JcMap} map 如果map 存在则显示，不存在则隐藏
   */
  setMap(map) {
    if (map) {
      this.map = map
      this.show()
    } else {
      this.hide()
    }
  }

  /**
   * 隐藏标记
   */
  hide() { }

  /**
   * 地图自适应 显示
   */
  fitView() {
    if (this.map) {
      this.map.fitView(this)
    }
  }

  /**
   * 添加事件监听
   * @param {*} event 事件名称
   * @param {*} cb 回调
   */
  on() { }

  /**
   * 移除事件监听
   * @param {*} event 事件名称
   * @param {Function} cb 需要移除的回调
   */
  off() { }

  /**
   * 设置样式
   * @param {String} style
   */
  setStyle(style) {
    this.style = style
  }

  /**
   * 日志输出
   */
  console() {
    if (this.debug) {
      console.log(...arguments)
    }
  }

  get [Symbol.toStringTag]() {
    return 'JcMapSign'
  }
}

export default JcMapSign
