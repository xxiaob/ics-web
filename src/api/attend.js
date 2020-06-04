/**
 * 考勤管理
 */
import axios from 'axios'
import API from './API'

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
