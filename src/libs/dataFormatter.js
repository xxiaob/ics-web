//数据  转换处理 类
/**
 * 数字自动添加逗号
 * @param {Int16Array} num 转换数字
 * @returns {String} 转换的数字
 */
export function numberFormatter(num) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}
/**
 * 金额转换，保留位数
 * @param { String } amount 金额
 * @param { Number } num 格式化位数，默认 8
 * @returns { String } 格式化后的数据
 */
export function amountFormatter(amount = 0, num = 8) {
  return parseFloat(amount || 0).toFixed(num).replace(/(?:\.0*|(\.\d+?)0+)$/, '$1') * 1
}
