/**
 * 法律法规
 */
import axios from 'axios'
import API from './API'

/*-------------------------------法律法规----------------------------------- */
/**
 * 获取法规类型
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getByType(data) {
  return axios.post(API.supervise.getByType, {}, {
    params: data
  })
}

/**
 * 新增法规
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function statuteAdd(data) {
  return axios.post(API.supervise.add, data)
}

/**
 * 法规列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getStatuteList(data) {
  return axios.post(API.supervise.list, data)
}
