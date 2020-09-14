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
/**
 * 获取状态
 * @returns {Object} axios 对象
 */
export function getStatus() {
  return axios.post(API.dregsAlarm.statusList)
}

/**
 * 查询告警台账转为的任务
 * @param {object} data 参数对象
 * @param {string} sourceId  告警id
 * @param {string} sourceType   告警类型
 * @returns {Object} axios 对象
 */

export function getTaskByResource(data) {
  return axios.post(API.dregsAlarm.getTaskByResource, null, {
    params: data
  })
}

/**
 * 关闭告警
 * @param {object} data 参数对象
 * @param {string} id  告警id
 * @returns {Object} axios 对象
 */

export function closeAlarm(data) {
  return axios.post(API.dregsAlarm.closeAlarm, null, {
    params: data
  })
}


