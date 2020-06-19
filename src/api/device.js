/**
 * 处理设备升级
 */
import axios from 'axios'
import API from './API'

/*-------------------------------设备升级------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceList(data) {
  return axios.post(API.device.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceAdd(data) {
  return axios.post(API.device.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceUpdate(data) {
  return axios.post(API.device.update, data)
}
/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceSave(data) {
  return data.id ? deviceUpdate(data) : deviceAdd(data)
}
/**
 * 删除
 * @param {Array} deviceUpgPkgIds
 * @returns {Object} axios 对象
 */
export function deviceDel(deviceUpgPkgIds) {
  return axios.post(API.device.del, { deviceUpgPkgIds })
}
