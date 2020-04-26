/**接口参数格式化 */
import { formatDate } from '@/libs/util'
import { MAP_SIGN_TYPE } from '@/constant/CONST'

export const baseValue = '--' //如果值不存在的默认值

/**
 *  Api边界转换
 * @param { Object } boundaries 后台返回的数组
 * @returns {Object} 返回处理过的数据
 */

export function apiBoundariesFormat(boundaries = {}) {
  let result = []

  //处理圆形
  if (boundaries.withRadiusReqs && boundaries.withRadiusReqs.length) {
    boundaries.withRadiusReqs.forEach(item => {
      result.push({ type: MAP_SIGN_TYPE.Polygon, center: [item.lng, item.lat], radius: item.radius })
    })
  }

  //处理矩形
  if (boundaries.withoutRadiusReqs && boundaries.withoutRadiusReqs.length) {
    boundaries.withoutRadiusReqs.forEach(item => {
      if (item.withSequenceReqs && item.withSequenceReqs.length) {
        let resultItem = { type: MAP_SIGN_TYPE.Polygon, path: [] }

        for (let i = 0; i < item.withSequenceReqs.length; i++) {
          resultItem.path.push([item.withSequenceReqs[i].lng, item.withSequenceReqs[i].lat])
        }
        result.push(resultItem)
      }
    })
  }

  return result
}
