/**
 * 域名logo配置
 */
import axios from 'axios'
import API from './API'

/*-------------------------------域名logo配置------------------------------------ */
/**
 * 列表 - 所有
 * @returns {Object} axios 对象
 */
export function listAll() {
  return axios.post(API.domainLogo.list)
}
/**
 * 列表 - 分页
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function listByPage(data) {
  return axios.post(API.domainLogo.listByPage, data)
}
/**
 * 新增
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function add(data) {
  return axios.post(API.domainLogo.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function upd(data) {
  return axios.post(API.domainLogo.upd, data)
}
/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function save(data) {
  return data.id ? upd(data) : add(data)
}
/**
 * 删除
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function del(data) {
  return axios.post(API.domainLogo.del, data)
}
