/**
 * 地图标记点
 */

class JcMapMarket {
  /**
   * 构造
   * @param {*} options
   * @param {Object} options.debug 配置 设法开启debug 模式，默认true
   * @param {String} options.id 标识id，当id 为空时会生成唯一id
   * @param {String} options.icon 中心点标记图标，可以为url，也可以为JcIcons 的 key
   * @param {String} options.name 标记名称
   * @param {JcMap} options.map JcMap地图对象
   * @param {*} options.extData 额外参数，用于自定义数据处理
   * @param {Array<String>} options.position 标记中心点
   * @param {String} options.mapStyle 地图使用样式key,对应mapStyle枚举
   * @param {Boolean} options.draggable 是否可以拖动
   * @param {Boolean} options.titleVisible 标题是否可见
   */
  constructor(options = {}) {
    this.debug = options.debug || true
    this.id = options.id || new Date().getTime()
    this.icon = options.icon || null
    this.name = options.name || ''
    this.map = options.map || null
    this.extData = options.extData
    this.position = options.position || []
    this.mapStyle = options.mapStyle
    this.draggable = options.draggable || false
    this.titleVisible = options.titleVisible == false ? false : true
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
   * 设置坐标点
   */
  setPosition() { }

  /**
   * 获取坐标点
   */
  getPosition() { }

  /**
   * 地图自适应 显示
   */
  fitView() {
    if (this.map) {
      this.map.fitView([this])
    }
  }

  /**
   * 获取地图对象
   */
  getMapTargets() { }

  /**
   * 日志输出
   */
  console() {
    if (this.debug) {
      console.log(...arguments)
    }
  }

  get [Symbol.toStringTag]() {
    return 'JcMapMarket'
  }
}

export default JcMapMarket
