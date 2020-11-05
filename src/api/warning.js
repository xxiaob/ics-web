/**
 * 处理告警
 */
import axios from 'axios'
import API from './API'

/*-------------------------------系统告警------------------------------------ */
/**
 * 详情
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getDetail(data) {
  return axios.post(API.warning.getDetail, data)
}
