/**
 * 组织信息
 */
import axios from 'axios'
import API from './API'


/*-------------------------------组织信息------------------------------------ */
/**
 *  人员信息库列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getUserInfoList(data = {}) {
  return axios.post(API.organizeInfo.userInfo.list, data)
}

/**
 *  人员信息库单个信息导出
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function exportUserInfo(data = {}) {
  return axios.post(API.organizeInfo.userInfo.userExport, data)
}


/**
 *  人员信息库列表信息导出
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function exportUserList(data = {}) {
  return axios.post(API.organizeInfo.userInfo.userListExport, data)
}
