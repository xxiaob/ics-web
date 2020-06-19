/**
 * 处理PTT群组
 */
import axios from 'axios'
import API from './API'

/*-------------------------------PTT群组------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function pttGroupList(data) {
  return axios.post(API.pttGroup.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function pttGroupAdd(data) {
  return axios.post(API.pttGroup.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function pttGroupUpdate(data) {
  return axios.post(API.pttGroup.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function pttGroupSave(data) {
  return data.groupId ? pttGroupUpdate(data) : pttGroupAdd(data)
}
/**
 * 删除
 * @param {Array} groupId
 * @returns {Object} axios 对象
 */
export function pttGroupDel(groupId) {
  return axios.post(API.pttGroup.del, { groupId })
}
