/**
 * 处理数据大屏接口
 */
import axios from 'axios'
import API from './API'

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
