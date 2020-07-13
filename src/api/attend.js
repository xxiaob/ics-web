/**
 * 考勤管理
 */
import axios from 'axios'
import API from './API'
import qs from 'qs'

/*-------------------------------考勤管理------------------------------------ */
/**
 * 我的考勤列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function myAttendList(data) {
  return axios.post(API.attend.myAttendList, data)
}
/**
 * 到岗查询列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function inPostList(data) {
  return axios.post(API.attend.inPostList, data)
}
/**
 * 人员考勤列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function userAttendList(data) {
  return axios.post(API.attend.userAttendList, data)
}
/**
 * 岗点考勤列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function postAttendList(data) {
  return axios.post(API.attend.postAttendList, data)
}
/**
 * 人员督查列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function userOverseeList(data) {
  return axios.post(API.attend.userOverseeList, data)
}
/**
 * 岗点督查列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function postOverseeList(data) {
  return axios.post(API.attend.postOverseeList, data)
}
/**
 * 人员督查添加记录
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function addUserOversee(data) {
  return axios.post(API.attend.addUserOversee, data)
}
/**
 * 岗点督查添加记录
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function addPostOversee(data) {
  return axios.post(API.attend.addPostOversee, data)
}

/**
 * 我的考勤导出
 * @param {object} data
 */
export function exportMyAttend(data) {
  window.open(process.env.apiHostConfig.base + API.attend.exportMyAttend + '?' + qs.stringify(data))
}
/**
 * 人员考勤导出
 * @param {object} data
 */
export function exportPeopleAttend(data) {
  window.open(process.env.apiHostConfig.base + API.attend.exportPeopleAttend + '?' + qs.stringify(data))
}
/**
 * 岗点考勤导出
 * @param {object} data
 */
export function exportPostAttend(data) {
  window.open(process.env.apiHostConfig.base + API.attend.exportPostAttend + '?' + qs.stringify(data))
}
/**
 * 人员督查导出
 * @param {object} data
 */
export function exportUserOversee(data) {
  window.open(process.env.apiHostConfig.base + API.attend.exportUserOversee + '?' + qs.stringify(data))
}
/**
 * 岗点督查导出
 * @param {object} data
 */
export function exportPostOversee(data) {
  window.open(process.env.apiHostConfig.base + API.attend.exportPostOversee + '?' + qs.stringify(data))
}
/**
 * 到岗查询导出
 * @param {object} data
 */
export function exportInPostAttend(data) {
  window.open(process.env.apiHostConfig.base + API.attend.exportInPostAttend + '?' + qs.stringify(data))
}


/**
 * 考勤配置列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function cfgList(data) {
  return axios.post(API.attend.cfgList, data)
}
/**
 * 考勤配置新增
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function cfgAdd(data) {
  return axios.post(API.attend.cfgAdd, data)
}
/**
 * 考勤配置修改
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function cfgUpdate(data) {
  return axios.post(API.attend.cfgUpdate, data)
}
/**
 * 考勤配置更新状态
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function uptStatus(data) {
  return axios.post(API.attend.uptStatus, data)
}
/**
 * 考勤配置保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function cfgSave(data) {
  return data.id ? cfgUpdate(data) : cfgAdd(data)
}
/**
 * 考勤配置详情
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function cfgGet(id) {
  return axios.post(API.attend.cfgGet + '?id=' + id)
}
/**
 * 考勤配置删除
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function cfgDel(id) {
  return axios.post(API.attend.cfgDel + '?id=' + id)
}
