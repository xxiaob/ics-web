/**
 * 系统使用字典定义
 */
/**
 * 定义字典枚举
 */
class JcEnum {
  /**
   * 构造
   * @param {Array} values 基础数据
   */
  constructor(values) {
    this.VALUES = values
    this.map = new Map()

    values.forEach(item => {
      this[item.key] = item.value
      this.map.set(item.value, item.label)
    })
  }

  /**
   * 转显示字符串
   * @param {String | Array} keys 转换对象
   * @returns {String} 处理的字符串
   */
  toString(keys) {
    if (keys) {
      if (keys instanceof Array) {
        let result = []

        keys.forEach(key => {
          let label = this.map.get(key)

          if (label) {
            result.push(label)
          }
        })
        return result.join(',')
      } else {
        return this.map.get(keys) || ''
      }
    }
    let result = []

    for (const [value, label] of this.map) {
      result.push(label)
    }
    return result.join(',')
  }

  get [Symbol.toStringTag]() {
    return 'JcEnum'
  }
}

/**
  * 允许登录终端
  */
export const LOGIN_DEVICE_TYPES = new JcEnum([
  { key: 'PC', value: '1', label: '电脑端' },
  { key: 'MOBILE', value: '2', label: '移动端' },
  { key: 'LAW', value: '3', label: '行政执法仪' }
])
