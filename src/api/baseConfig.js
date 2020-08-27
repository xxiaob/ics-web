/**
 * 基础配置
 */
import axios from 'axios'
import API from './API'

/*-------------------------------基础配置------------------------------------ */
/**
 * 详情
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function getDetail(data) {
  return axios.post(API.baseConfig.get, data)
}

/**
 * 更新基础信息
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function updateBase(data) {
  return axios.post(API.baseConfig.updateBase, data)
}

/**
 * 获取廉政提醒列表
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function getRollingMessage(data) {
  return axios.post(API.baseConfig.list, data)
}

/**
 * 新增廉政提醒
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function rollingMessageAdd(data) {
  return axios.post(API.baseConfig.add, data)
}


/**
 * 更新廉政提醒
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function rollingMessageUpdate(data) {
  return axios.post(API.baseConfig.add, data)
}

/**
 * 更新廉政提醒
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function rollingMessageSave(data) {
  return data.messageId ? rollingMessageUpdate(data) : rollingMessageAdd(data)
}


