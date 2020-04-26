/**
 * 自定义地图标记
 * 用于承接不同地图的标记处理，具体方法和参数，可见MapSignBase类
 */
import MapSign from './aMap/aMapSign'

class JcMapSign extends MapSign {
  /**
   * 构造
   * @param {*} options
   */
  constructor(options) {
    super(options)
  }

  get [Symbol.toStringTag]() {
    return 'JcMapSign'
  }
}

export default JcMapSign
