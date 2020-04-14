/**
 * 处理角色
 */
import axios from 'axios'
import API from './API'

/*-------------------------------角色管理------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function roleList(data = {}) {
  return axios.post(API.role.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function roleAdd(data) {
  return axios.post(API.role.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function roleUpdate(data) {
  return axios.post(API.role.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function roleSave(data) {
  return data.roleId ? roleUpdate(data) : roleAdd(data)
}
/**
 * 详情
 * @param {String} roleId
 * @returns {Object} axios 对象
 */
export function roleGet(roleId) {
  return axios.post(API.role.get, { roleId })
}
/**
 * 删除
 * @param {String} roleId
 * @returns {Object} axios 对象
 */
export function roleDel(roleId) {
  return axios.post(API.role.del, { roleId })
}
