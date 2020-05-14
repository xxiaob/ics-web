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
      result.push({ type: MAP_SIGN_TYPE.Circle, center: [item.lng, item.lat], radius: item.radius })
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

  //处理线段
  if (boundaries.withExtWidthReqs && boundaries.withExtWidthReqs.length) {
    boundaries.withExtWidthReqs.forEach(item => {
      if (item.withExtWidthReqs && item.withExtWidthReqs.length) {
        let resultItem = { type: MAP_SIGN_TYPE.Polyline, path: [], extWidth: item.withExtWidthReqs[0].extWidth }

        for (let i = 0; i < item.withExtWidthReqs.length; i++) {
          resultItem.path.push([item.withExtWidthReqs[i].lng, item.withExtWidthReqs[i].lat])
        }
        result.push(resultItem)
      }
    })
  }

  return result
}
/**
 * 处理编辑返回的数据，使之可以进行后台接口提交
 * @param { Object } data 编辑返回的数据
 * @returns {Object} 返回处理过的数据
 */

export function signEditDataFormat(data = {}) {
  let result = { center: data.center ? data.center.join(',') : '', withRadiusReqs: [], withExtWidthReqs: [], withoutRadiusReqs: [] }

  //处理边界数据
  if (data.boundaries && data.boundaries.length) {
    data.boundaries.forEach(item => {
      if (item.type == MAP_SIGN_TYPE.Polygon) {
        //处理矩形
        let withSequenceReqs = []

        item.path.forEach(dot => {
          withSequenceReqs.push({ sequence: dot.index, lat: dot.lat, lng: dot.lng })
        })
        result.withoutRadiusReqs.push({ withSequenceReqs: withSequenceReqs })
      } else if (item.type == MAP_SIGN_TYPE.Circle) {
        //处理圆形
        result.withRadiusReqs.push({ lat: item.lat, lng: item.lng, radius: item.radius })
      } else if (item.type == MAP_SIGN_TYPE.Polyline) {
        //处理线段
        let withExtWidthInnerReqs = []

        item.path.forEach(dot => {
          withExtWidthInnerReqs.push({ sequence: dot.index, lat: dot.lat, lng: dot.lng, extWidth: dot.extWidth })
        })
        result.withExtWidthReqs.push({ withExtWidthInnerReqs: withExtWidthInnerReqs })
      }
    })
  }

  return result
}
