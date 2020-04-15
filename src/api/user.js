/**
 * 处理用户
 */
import axios from 'axios'
import API from './API'

/*-------------------------------用户管理------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function userList(data = {}) {
  return axios.post(API.user.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function userAdd(data) {
  return axios.post(API.user.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function userUpdate(data) {
  return axios.post(API.user.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function userSave(data) {
  return data.userId ? userUpdate(data) : userAdd(data)
}
/**
 * 详情
 * @param {String} userId
 * @returns {Object} axios 对象
 */
export function userGet(userId) {
  return axios.post(API.user.get + `?userId=${userId}`)
}
/**
 * 删除
 * @param {String} delIdS
 * @returns {Object} axios 对象
 */
export function userDel(delIdS) {
  return axios.post(API.user.del, delIdS)
}
/**
 * 重置密码
 * @param {String} userId
 * @returns {Object} axios 对象
 */
export function resetUserPwd(userId) {
  return axios.post(API.user.resetUserPwd + `?userId=${userId}`)
}
/**
 * 更新是否为默认接收人
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function updateOrgReceiver(data) {
  return axios.post(API.user.updateOrgReceiver, data)
}
