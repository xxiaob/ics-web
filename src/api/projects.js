/**
 * 处理组织
 */
import axios from 'axios'
import API from './API'

/*-------------------------------项目管理------------------------------------ */
/**
 * 列表 分页
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function projectsListByPage(data = {}) {
  return axios.post(API.projects.listByPage, data)
}
/**
 * 列表 不分页
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function projectsList(data = {}) {
  return axios.post(API.projects.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function projectsAdd(data) {
  return axios.post(API.projects.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function projectsUpdate(data) {
  return axios.post(API.projects.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function projectsSave(data) {
  return data.projectId ? projectsUpdate(data) : projectsAdd(data)
}
/**
 * 详情
 * @param {String} projectId
 * @returns {Object} axios 对象
 */
export function projectsGet(projectId) {
  return axios.post(API.projects.get, { projectId })
}
/**
 * 删除
 * @param {String} projectId
 * @returns {Object} axios 对象
 */
export function projectsDel(projectId) {
  return axios.post(API.projects.del, { projectId })
}