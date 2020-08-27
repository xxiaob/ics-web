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
 * 获取廉政提醒列表
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function getRollingMessage(data) {
  return axios.post(API.baseConfig.list, data)
}

