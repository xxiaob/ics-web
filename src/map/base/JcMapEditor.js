/**
 * 地图标记编辑基础类
 */
class JcMapEditor {
  /**
   * 构造
   * @param {*} options
   * @param {Object} options.debug 配置 设法开启debug 模式，默认true
   * @param {JcMap} options.map JcMap地图对象
   * @param {JcMapSign} options.sign 编辑的标记，或网格
   * @param {String} options.icon 中心点标记图标，可以为url，也可以为JcIcons 的 key
   */
  constructor(options = {}) {
    this.debug = options.debug || true
    this.map = options.map || null
    this.sign = options.sign || null
    this.icon = options.icon || null
    this.initEditor() //初始化编辑器
  }

  /**
   *初始化编辑器
   */
  initEditor() { }

  /**
   * 新增区域
   */
  addArea() { }

  /**
   * 恢复重置
   */
  reset() {
    //先销毁所有数据，然后进行重新初始化
    this.destroy()
    this.initEditor()
  }

  /**
   * 销毁编辑器
   */
  destroy() { }

  /**
   * 日志输出
   */
  console() {
    if (this.debug) {
      console.log(...arguments)
    }
  }

  get [Symbol.toStringTag]() {
    return 'JcMapEditor'
  }
}

export default JcMapEditor
