/**
 * 处理设备升级
 */
import axios from 'axios'
import API from './API'

/*-------------------------------设备管理------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceList(data) {
  return axios.post(API.device.list, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceUpdate(data) {
  return axios.post(API.device.update, data)
}
