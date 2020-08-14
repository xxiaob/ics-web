/**
 * 处理设备升级
 */
import axios from 'axios'
import API from './API'

/*-------------------------------设备管理------------------------------------ */
/**
 * 列表
 * @param {object} params
 * @returns {Object} axios 对象
 */
export function deviceList(params) {
  return axios.get(API.device.list, { params })
}
/**
 * 查询设备详情
 * @param {object} params
 * @returns {Object} axios 对象
 */
export function deviceDetail(params) {
  return axios.get(API.device.detail, { params })
}
/**
 * 设备绑定用户
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceBind(data) {
  return axios.post(API.device.bind, data)
}
/**
 * 获取回放流
 * @param {object} params
 * @returns {Object} axios 对象
 */
export function getRelay(params) {
  return axios.get(API.device.relay, { params })
}
