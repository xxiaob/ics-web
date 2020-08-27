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
 * 更新法规
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function statuteUpdate(data) {
  return axios.post(API.supervise.update, data)
}


/**
 * 法规列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getStatuteList(data) {
  return axios.post(API.supervise.list, data)
}

/**
 * 法规台账列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getCheckList(data) {
  return axios.post(API.supervise.checkList, data)
}


/**
 * 保存法规
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function statuteSave(data) {
  return data.id ? statuteUpdate(data) : statuteAdd(data)
}

/**
 * 删除法规
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function statuteDel(data) {
  return axios.post(API.supervise.del, {}, {
    params: data
  })
}
