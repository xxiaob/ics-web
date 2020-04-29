/**
 * 地图标记编辑基础类
 */
class JcMapEditor {
  /**
   * 构造
   * @param {*} options
   * @param {Object} options.debug 配置 设法开启debug 模式，默认true
   */
  constructor(options = {}) {
    this.debug = options.debug || true
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
    return 'JcMapEditor'
  }
}

export default JcMapEditor
