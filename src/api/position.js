/**
 * 职位管理
 */
import axios from 'axios'
import API from './API'

/*-------------------------------职位管理------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function positionList(data) {
  return axios.post(API.position.list, data)
}
/**
 * 列表
 * @returns {Object} axios 对象
 */
export function positionListAll() {
  return axios.post(API.position.listAll)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function positionAdd(data) {
  return axios.post(API.position.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function positionUpdate(data) {
  return axios.post(API.position.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function positionSave(data) {
  return data.positionId ? positionUpdate(data) : positionAdd(data)
}
/**
 * 详情
 * @param {String} positionId
 * @returns {Object} axios 对象
 */
export function positionGet(positionId) {
  return axios.post(API.position.get, { positionId })
}
/**
 * 删除
 * @param {Array} positionIds
 * @returns {Object} axios 对象
 */
export function positionDel(positionIds) {
  return axios.post(API.position.del, { positionIds })
}
