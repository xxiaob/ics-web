/**接口参数格式化 */
import { formatDate } from '@/libs/util'

export const baseValue = '--' //如果值不存在的默认值

/**
 *  将返回转成点数组
 * @param { Object } boundaries 后台返回的数组
 * @param { Object } extraParams 额外需要合并的参数
 * @returns {Object} 返回处理过的数据
 */

export function apiBoundariesFormat(boundaries = {}, extraParams) {
  let answer = { path: [] }

  if (boundaries && boundaries.length) {
    boundaries.forEach(item => {
      if (item.withSequenceReqs && item.withSequenceReqs.length) {
        let resultItem = []

        for (let i = 0; i < item.withSequenceReqs.length; i++) {
          resultItem.push([item.withSequenceReqs[i].lng, item.withSequenceReqs[i].lat])
        }
        answer.path.push(resultItem)
      }
    })
  }

  if (extraParams) {
    Object.assign(answer, extraParams)
  }
  return answer
}
