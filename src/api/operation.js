/**
 * 运维管理-第三方管理
 */
import axios from 'axios'
import API from './API'

/*-------------------------------第三方管理------------------------------------ */

/**
 * 列表
 * @returns {Object} axios 对象
 */

export function operationList(data) {
  return axios.post(API.operation.list, data)
}

/**
 * 第三方管理新增
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function operationAdd(data) {
  return axios.post(API.operation.add, data)
}

/**
 * 第三方管理修改
 * @param {object} data
 * @returns {Object} axios 对象
 */

export function operationUpdate(data) {
  return axios.post(API.operation.update, data)
}

/**
 * 第三方管理删除
 * @param {object} data
 * @returns {Object} axios 对象
 */

export function operationDel(operationId) {
  return axios.delete(API.operation.delete + operationId)
}

/**
 * 第三方管理保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function operationSave(data) {
  return data.appKey ? operationUpdate(data) : operationAdd(data)
}
