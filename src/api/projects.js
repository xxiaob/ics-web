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
 * 删除
 * @param {String} projectId
 * @returns {Object} axios 对象
 */
export function projectsDel(projectId) {
  return axios.post(API.projects.del, { projectId })
}
/*-------------------------------项目关联人员管理------------------------------------ */
/**
 * 列表 不分页
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function projectUserRefList(data = {}) {
  return axios.post(API.projects.projectUserRef.list, data)
}
/**
 * 保存&更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function projectUserRefSave(data = {}) {
  return axios.post(API.projects.projectUserRef.save, data)
}
