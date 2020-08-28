/**
 * 渣土管控
 */
import axios from 'axios'
import API from './API'

/*-------------------------------渣土管控------------------------------------ */
/**
 * 渣土告警列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getDregsAlarmList(data) {
  return axios.post(API.dregsAlarm.list, data)
}
