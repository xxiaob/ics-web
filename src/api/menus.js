/**
 * 处理菜单
 */
import axios from 'axios'
import API from './API'

/*-------------------------------菜单管理------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function menusList(data) {
  return axios.post(API.menus.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function menusAdd(data) {
  return axios.post(API.menus.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function menusUpdate(data) {
  return axios.post(API.menus.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function menusSave(data) {
  return data.resId ? menusUpdate(data) : menusAdd(data)
}
/**
 * 获取明细
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function menusGet(id) {
  return axios.post(API.menus.get, { id })
}
/**
 * 删除
 * @param {String} resId
 * @returns {Object} axios 对象
 */
export function menusDel(resId) {
  return axios.post(API.menus.del, { resId })
}
