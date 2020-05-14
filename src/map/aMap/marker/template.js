/**
 * 地图标记模板
 */
import { defaultMarketIcon, JcIcons } from '@/config/JcIconConfig'

/**
 * 返回url
 * @param {String} icon 可以为url，也可以为JcIcons 的 key
 * @returns {String} 标记地址
 */
let getIconUrl = function (icon) {
  if (icon) {
    let iconItem = JcIcons[icon]

    return iconItem ? iconItem.icon : icon
  }
  return defaultMarketIcon
}
/**
 *
 * @param {*} options 参数
 * @param {String} options.icon 中心点标记图标，可以为url，也可以为JcIcons 的 key
 * @param {String} options.title 中心点名称
 * @param {Boolean} options.titleVisible 标题是否可见
 * @returns {String} html字符串
 */

export function defaultMarker(options) {
  let result = '<div class="jc-market-content">'

  if (options.title && options.titleVisible) {
    result += `<div class="jc-market-title">${options.title}</div>`
  }
  result += `<img src=${getIconUrl(options.icon)} class="jc-market-icon"/></div>`
  return result
}
