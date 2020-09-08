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
   * @param {String} options.icon 中心点标记图标，可以为url，也可以为JcIcons 的 key
   * @param {JcMap} options.map JcMap地图对象
   * @param {Boolean} options.active 是否使用选中样式
   * @param {Boolean} options.debug 配置 设法开启debug 模式，默认true
   * @param {String} options.mapStyle 地图使用样式key,对应mapStyle枚举
   * @param {Array} options.boundaries 边界数组
   * @param {Boolean} options.areaVisible 是否显示区域边界
   * @param {Boolean} options.signVisible 标记是否可见，如果标记不可见，则标题固定不可见
   * @param {Boolean} options.tipVisible 是否显示中心点tip
   */
  constructor(options) {
    this.debug = options.debug || true
    this.id = options.id || new Date().getTime()
    this.name = options.name || ''
    this.extData = options.extData
    this.center = options.center || []
    this.icon = options.icon || null
    this.boundaries = options.boundaries || []
    this.map = options.map || null
    this.active = options.active || false
    this.mapStyle = options.mapStyle
    this.areaVisible = options.areaVisible == false ? false : true
    this.signVisible = options.signVisible == false ? false : true
    this.tipVisible = options.tipVisible == false ? false : true
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
   * 显示中心点和说明
   */
  showTip() { }

  /**
   * 隐藏中心点和说明
   */
  hideTip() { }

  /**
   * 显示边界区域
   */
  showArea() { }

  /**
   * 隐藏边界区域
   */
  hideArea() { }

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
    this.mapStyle = style
  }

  /**
   * 设置样式为active 样式
   */
  signActive() { }

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
