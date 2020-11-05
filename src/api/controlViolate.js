/**
 * 智慧控违
 */
import axios from 'axios'
import API from './API'

/*-------------------------------告警台账------------------------------------ */
/**
 * 告警台账类表
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function getControlList(data) {
  return axios.post(API.controlViolate.list, data)
}
