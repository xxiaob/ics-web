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
export function deviceUpdateList(data) {
  return axios.post(API.deviceUpdate.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceUpdateAdd(data) {
  return axios.post(API.deviceUpdate.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceUpdateUpdate(data) {
  return axios.post(API.deviceUpdate.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceUpdateSave(data) {
  return data.id ? deviceUpdateUpdate(data) : deviceUpdateAdd(data)
}
/**
 * 根据ID查询详情
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceUpdateGet(data) {
  return axios.post(API.deviceUpdate.get, data)
}
/**
 * 删除
 * @param {Array} deviceUpgPkgIds
 * @returns {Object} axios 对象
 */
export function deviceUpdateDel(deviceUpgPkgIds) {
  return axios.post(API.deviceUpdate.del, { deviceUpgPkgIds })
}
