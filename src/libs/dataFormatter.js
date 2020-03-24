//数据  转换处理 类
/**
 * 数字自动添加逗号
 * @param {Int16Array} num 转换数字
 * @returns {String} 转换的数字
 */
export function numberFormatter(num) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}
