/**
 * 基础配置
 */
import axios from 'axios'
import API from './API'

/*-------------------------------基础配置------------------------------------ */
/**
 * 获取基础信息
 * @returns {Object} axios 对象
 */
export function getBase() {
  return axios.post(API.baseConfig.getBase)
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
  return axios.post(API.baseConfig.update, data)
}

/**
 * 删除廉政提醒
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function rollingMessageDel(data) {
  return axios.get(API.baseConfig.del, {
    params: data
  })
}

/**
 * 更新廉政提醒
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function rollingMessageSave(data) {
  return data.messageId ? rollingMessageUpdate(data) : rollingMessageAdd(data)
}

/**
 * 根据组织获取滚动消息
 * @returns {Object} axios 对象
 */
export function getEnabledRollingMessage() {
  return axios.get(API.baseConfig.getEnabledRollingMessage)
}

/**
 * 获取APPBanner列表
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function appBannerList(data) {
  return axios.post(API.baseConfig.appBannerList, data)
}

/**
 * 新增appbanner
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function addAppBanner(data) {
  return axios.post(API.baseConfig.addAppBanner, data)
}

/**
 * 删除appbanner
 * @param {String} id 参数
 * @returns {Object} axios 对象
 */
export function deleteAppBanner(id) {
  return axios.post(API.baseConfig.deleteAppBanner + id)
}
/**
 * 启用appbanner
 * @param {String} id 参数
 * @param {String} enable 参数
 * @returns {Object} axios 对象
 */
export function enableAppBanner({ id, enable }) {
  return axios.post(API.baseConfig.enableAppBanner + id + '?flag=' + enable)
}
