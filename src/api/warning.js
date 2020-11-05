/**
 * 处理告警
 */
import axios from 'axios'
import API from './API'
import { download } from '@/libs/download'


/*-------------------------------系统告警------------------------------------ */
/**
 * 详情
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getDetail(data) {
  return axios.post(API.warning.getDetail, data)
}


/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getAlarmList(data) {
  return axios.post(API.warning.list, data)
}


/**
 * 发送提醒
 * @param {object} id 告警id
 * @returns {Object} axios 对象
 */
export function sendRemind(id) {
  return axios.post(API.warning.send + `?alarmId=${id}`)
}

/**
 *  告警列表导出
 * @param {object} data
 *
 */
export function exportAlarmList(data = {}) {
  download('告警列表.xlsx', API.warning.export, data)
}
