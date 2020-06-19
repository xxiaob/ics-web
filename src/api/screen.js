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
