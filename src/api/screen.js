/**
 * 处理大屏接口
 */
import axios from 'axios'
import API from './API'
import qs from 'qs'

/*-------------------------------指挥大屏接口------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @param { String } data.orgId 组织id
 * @param { String } data.projectId 项目id
 * @returns {Object} axios 对象
 */
export function getCommandScreenData(data) {
  return axios.post(API.screen.command.getCommandScreenData + '?' + qs.stringify(data))
}

/**
 * 根据用户和网格查询任务域数据
 * @param {object} data
 * @param { String } data.orgId 组织id
 * @param { String } data.areaId 网格id
 * @param { String } data.projectId 项目id
 * @returns {Object} axios 对象
 */
export function getScreenData(data) {
  return axios.post(API.screen.command.getScreenData, data)
}

/**
 * 岗点考勤事件流水
 * @param {object} data
 * @param { String } data.areaId 网格id
 * @param { String } data.projectId 项目id
 * @returns {Object} axios 对象
 */
export function getTaskPostLine(data) {
  return axios.post(API.screen.command.getTaskPostLine, data)
}

/**
 * 个人考勤事件流水
 * @param {object} data
 * @param { String } data.userId 用户id
 * @param { String } data.projectId 项目id
 * @returns {Object} axios 对象
 */
export function getTaskPersonalLine(data) {
  return axios.post(API.screen.command.getTaskPersonalLine, data)
}
