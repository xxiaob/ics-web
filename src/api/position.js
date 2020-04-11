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
  return data.resId ? positionUpdate(data) : positionAdd(data)
}
/**
 * 获取明细
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function positionGet(id) {
  return axios.post(API.position.get, { id })
}
/**
 * 删除
 * @param {String} resId
 * @returns {Object} axios 对象
 */
export function positionDel(resId) {
  return axios.post(API.position.del + `?resId=${resId}`)
}
