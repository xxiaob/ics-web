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
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function taskAdd(data) {
  return axios.post(API.task.add, data)
}

/**
 * 我的考勤导出
 * @param {object} data
 */
export function exportMyAttend(data) {
  window.open(process.env.API_HOST.base + API.attend.exportMyAttend + '?' + qs.stringify(data))
}
/**
 * 人员考勤导出
 * @param {object} data
 */
export function exportPeopleAttend(data) {
  window.open(process.env.API_HOST.base + API.attend.exportPeopleAttend + '?' + qs.stringify(data))
}
/**
 * 岗点考勤导出
 * @param {object} data
 */
export function exportPostAttend(data) {
  window.open(process.env.API_HOST.base + API.attend.exportPostAttend + '?' + qs.stringify(data))
}
/**
 * 人员督查导出
 * @param {object} data
 */
export function exportUserOversee(data) {
  window.open(process.env.API_HOST.base + API.attend.exportUserOversee + '?' + qs.stringify(data))
}
/**
 * 岗点督查导出
 * @param {object} data
 */
export function exportPostOversee(data) {
  window.open(process.env.API_HOST.base + API.attend.exportPostOversee + '?' + qs.stringify(data))
}
