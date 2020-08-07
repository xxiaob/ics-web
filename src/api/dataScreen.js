/**
 * 处理数据大屏接口
 */
import axios from 'axios'
import API from './API'
import qs from 'qs'

/*-------------------------------数据大屏接口------------------------------------ */
/**
 * 信息累计和区域占比
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getAccumulateInfo(data) {
  return axios.post(API.screen.dataStatistics.accumulateInfo, data)
}
/**
 * 事务类型占比
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getTransactionType(data) {
  return axios.post(API.screen.dataStatistics.transactionType, data)
}

/**
 * 大屏区域出勤数据
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getAreaService(data) {
  return axios.get(API.screen.dataStatistics.getAreaService, {
    params: data
  })
}

/**
 * 大屏总体出勤数据
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getOverallAttendance(data) {
  return axios.get(API.screen.dataStatistics.getOverallAttendance, {
    params: data
  })
}

/**
 * AI智能分析
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getEventGroupByEventType(data) {
  return axios.post(API.screen.dataStatistics.getEventGroupByEventType, data)
}

/**
 * 数据大屏地图各区域数据统计
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getAreaDataStatistics(data) {
  return axios.get(API.screen.dataStatistics.getAreaDataStatistics + '?' + qs.stringify(data, { indices: false }))
}
