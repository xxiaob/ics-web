/**
 * 地图搜索
 */

class JcMapSearch {
  /**
   * 构造
   * @param {*} options
   * @param {Object} options.debug 配置 设法开启debug 模式，默认true
   * @param {JcMap} options.map JcMap地图对象
   */
  constructor(options = {}) {
    this.debug = options.debug || true
    this.map = options.map || null
  }

  /**
   * 搜索
   */
  async search() { }

  /**
   * 地图自适应 显示搜索内容
   */
  fitView() { }

  /**
   * 日志输出
   */
  console() {
    if (this.debug) {
      console.log(...arguments)
    }
  }

  get [Symbol.toStringTag]() {
    return 'JcMapSearch'
  }
}

export default JcMapSearch
