/**
 * ws socket连接
 */
import API from './API'
import qs from 'qs'

const baseUrl = process.env.API_HOST.ws /*eslint-disable-line*/
import JcSocket from '@/libs/JcSocket'
import { getToken } from '@/libs/storage'

/**
 * 实时事件问题推送
 * @param {*} data 参数
 * @param {String} data.token token
 * @param {String} data.subOrgId 组织id
 * @param {String} data.subProjectId 项目id
 * @returns {Object} JcSocket 对象
 */
export function screenMapSocket(data) {
  data.token = getToken() // 设置请求用户token
  return new JcSocket(baseUrl + API.screen.command.screenMap + '?' + qs.stringify(data))
}

