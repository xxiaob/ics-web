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
export function eventManageList(data) {
  return axios.post(API.eventManage.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function eventManageAdd(data) {
  return axios.post(API.eventManage.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function eventManageUpdate(data) {
  return axios.post(API.eventManage.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function eventManageSave(data) {
  return data.id ? eventManageUpdate(data) : eventManageAdd(data)
}
/**
 * 删除
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function eventManageDel(id) {
  return axios.post(API.eventManage.del + '?id=' + id)
}
