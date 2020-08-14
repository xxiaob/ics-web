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
 * 根据用户和网格查询综合数据
 * @param {object} data
 * @param { String } data.orgId 组织id
 * @param { String } data.areaId 网格id
 * @param { String } data.projectId 项目id
 * @returns {Object} axios 对象
 */
export function getScreenOverallData(data) {
  return axios.post(API.screen.command.getScreenOverallData, data)
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

/**
 * 获取用户历史定位
 * @param {object} data
 * @param { String } data.userId 用户id
 * @returns {Object} axios 对象
 */
export function getUserHistoryPosition(data) {
  return axios.post(API.screen.command.getUserHistoryPosition, data)
}

/**
 * 最近两天未完成的临时任务
 * @param {object} data
 * @param { String } data.orgId 组织id
 * @param { String } data.projectId 项目id
 * @returns {Object} axios 对象
 */
export function getScreenTask(data) {
  return axios.post(API.screen.command.getScreenTask + '?' + qs.stringify(data))
}

/**
 * 指挥大屏事件数据
 * @param {object} data
 * @param { String } data.orgId 组织id
 * @param { String } data.projectId 项目id
 * @param { String } data.startTime 开始时间
 * @param { String } data.endTime 结束时间
 * @returns {Object} axios 对象
 */
export function getScreenEventData(data) {
  return axios.post(API.screen.command.getScreenEventData, data)
}


/**
 * 指挥大屏问题数据
 * @param {object} data
 * @param { String } data.orgId 组织id
 * @param { String } data.projectId 项目id
 * @param { String } data.startTime 开始时间
 * @param { String } data.endTime 结束时间
 * @returns {Object} axios 对象
 */
export function getScreenProblemData(data) {
  return axios.post(API.screen.command.getScreenProblemData, data)
}


/**
 * 指挥大屏设备数据
 * @param {object} params
 * @returns {Object} axios 对象
 */
export function getScreenDeviceData(params) {
  return axios.get(API.screen.command.getScreenDeviceData, { params })
}


